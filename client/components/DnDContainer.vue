<script setup lang="ts">
import { moveItem } from '$utils'
import Sortable from 'sortablejs'
import type { SortableEvent } from 'sortablejs'

// Types
import type { IDndContainerProps } from '~/types/dnd-container-props.type'
import type { IDnDContainerEmits } from '~/types/dnd-container-emits.type'
import SortableRevertPlugin from '~/constants/sortable-plugins/revert-last'

const props = withDefaults(defineProps<IDndContainerProps>(), {
  itemKey: 'id',
  sortableOptions: () => ({}),
})

const emits = defineEmits<IDnDContainerEmits>()

// Utils
const hasJustBeenCalled = refAutoReset(false, 10)
let lastX = 0
let lastY = 0
let lastHorizontalDirection: 'left' | 'right' | undefined
let lastVerticalDirection: 'up' | 'down' | undefined
const { x, y } = useSharedMouse()

// Layout
const el = useTemplateRef('el')
const sortable = shallowRef<Sortable>()
const items = defineModel<IItem[]>('items', { required: true })
const isDisabled = defineModel('disabled', { default: false })
const draggedItem = ref<IItem>()

const { resume, pause } = useRafFn(scrollContainers, { immediate: false })

const itemIdsStrings = computed(() => {
  return items.value.map(item => get(item, props.itemKey)).join(',')
})

function onStart(ev: SortableEvent) {
  // @ts-expect-error DOM function
  draggedItem.value = ev.item.getItem()

  props.sortableOptions.onStart?.(ev)

  // Start containers scrolling
  lastX = x.value
  lastY = y.value

  resume()
}

function scrollContainers() {
  const THRESHOLD = 120
  const elements = document.elementsFromPoint(x.value, y.value)
  const containers = elements.filter(el => el.classList.contains('dnd-container'))

  if (x.value > lastX) {
    lastHorizontalDirection = 'right'
  } else if (x.value < lastX) {
    lastHorizontalDirection = 'left'
  }

  const horizontalContainers = containers
    .filter(container => container.classList.contains('direction--horizontal'))

  if (lastHorizontalDirection === 'right') {
    horizontalContainers.forEach(container => {
      const rect = container.getBoundingClientRect()
      const diff = (rect.x + rect.width) - x.value

      if (diff <= THRESHOLD && diff >= 0) {
        const speed = (1 - (diff / THRESHOLD)) * 15
        container.scrollLeft = container.scrollLeft + speed
      }
    })
  } else if (lastHorizontalDirection === 'left') {
    horizontalContainers.forEach(container => {
      const rect = container.getBoundingClientRect()
      const diff = x.value - rect.x

      if (diff <= THRESHOLD && diff >= 0) {
        const speed = (1 - (diff / THRESHOLD)) * 15
        container.scrollLeft = container.scrollLeft - speed
      }
    })
  }

  // Track vertical direction
  if (y.value > lastY) {
    lastVerticalDirection = 'down'
  } else if (y.value < lastY) {
    lastVerticalDirection = 'up'
  }

  // Handle vertical scrolling
  const verticalContainers = containers
    .filter(container => container.classList.contains('direction--vertical'))

  if (lastVerticalDirection === 'down') {
    verticalContainers.forEach(container => {
      const rect = container.getBoundingClientRect()
      const diff = (rect.y + rect.height) - y.value

      if (diff <= THRESHOLD && diff >= 0) {
        const speed = (1 - (diff / THRESHOLD)) * 15
        container.scrollTop = container.scrollTop + speed
      }
    })
  } else if (lastVerticalDirection === 'up') {
    verticalContainers.forEach(container => {
      const rect = container.getBoundingClientRect()
      const diff = y.value - rect.y

      if (diff <= THRESHOLD && diff >= 0) {
        const speed = (1 - (diff / THRESHOLD)) * 15
        container.scrollTop = container.scrollTop - speed
      }
    })
  }

  lastX = x.value
  lastY = y.value
}

async function onEnd(ev: SortableEvent) {
  pause()

  // We are using the `CancelSortPlugin` which may modify the dragEnd event,
  // for that case, we make sure to ignore the first event
  // if (!hasJustBeenCalled.value) {
  //   hasJustBeenCalled.value = true

  //   return
  // }

  const from = ev.from
  const fromIdx = ev.oldIndex

  const to = ev.to
  const toIdx = ev.newIndex

  // We temporarily set a state before we actually perform/commit the move
  if (props.sortableOptions.onEnd) {
    ev.item?.classList.add('is-intermediate')
  }


  const res = await props.sortableOptions.onEnd?.(ev)

  if (res === false) {
    // @ts-expect-error DOM function
    from?.revert?.()
    // @ts-expect-error DOM function
    to?.revert?.()

    ev.item?.classList.remove('is-intermediate')

    return
  }

  ev.item?.classList.remove('is-intermediate')

  if (from === to && fromIdx === toIdx) {
    refresh()
    props.sortableOptions.onEnd?.(ev)

    return
  }

  

  // Moved within the same list
  if (from === to) {
    // @ts-expect-error DOM function
    from.move({ fromIdx, toIdx, item: draggedItem.value })
  }

  // Moved to different list
  else {
    // @ts-expect-error DOM function
    from.move({ fromIdx, item: draggedItem.value })
    // @ts-expect-error DOM function
    to.move({ toIdx, item: draggedItem.value })
  }
}

function move(payload: {
  item: IItem
  fromIdx?: number
  toIdx?: number
}) {
  const { fromIdx, toIdx, item } = payload

  // If we moved an item within the container
  if (!isNil(fromIdx) && !isNil(toIdx)) {
    items.value = moveItem(items, fromIdx, toIdx)
  }

  // If we added an item from a different list
  else if (!isNil(toIdx)) {
    items.value = items.value.toSpliced(toIdx, 0, item)
  }

  // If we removed an item from a list
  else if (!isNil(fromIdx)) {
    items.value = items.value.toSpliced(fromIdx, 1)
  }

  requestAnimationFrame(() => {
    emits(
      'move:item',
      { fromIdx, toIdx, item, items: items.value },
    )
  })
}

function revert() {
  // @ts-expect-error Plugin function
  sortable.value?.revertLastMove?.()
}

function refresh() {
  const itemIds = items.value.map(item => String(get(item, props.itemKey)))
  sortable.value?.sort(itemIds)

  requestAnimationFrame(() => {
    // @ts-expect-error Sortable method on the DOM element
    el.value?.update?.()
  })
}

// Make sure to sync the `Sortable` instance items with the items data
watch(itemIdsStrings, () => {
  nextTick(() => refresh())
})

// Sync `disable` with Sortable
watch(isDisabled, isDisabled => sortable.value?.option('disabled', isDisabled))

onMounted(() => {
  const _el = unrefElement(el.value) as HTMLElement

  sortable.value = new Sortable(_el, {
    scroll: false,
    revertOnSpill: false,
    delay: 75,
    delayOnTouchOnly: true,
    fallbackTolerance: 3,
    forceFallback: true,

    ...props.sortableOptions,
    onStart,
    onEnd,
  })

  SortableRevertPlugin.attachTo(sortable.value)
})

defineExpose({
  refresh,
  revert,
  getSortableInstance: () => sortable.value,
})
</script>

<template>
  <div
    ref="el"
    class="dnd-container"
    :class="[ui?.containerClass, { 'is-disabled': disabled }, `direction--${direction}`]"
    :style="ui?.containerStyle"
    .move="move"
    .refresh="refresh"
    .revert="revert"
  >
    <DnDItem
      v-for="(item, index) in items"
      :key="get(item, itemKey)"
      :data-id="get(item, itemKey)"
      :item
      :selected="itemSelected?.(item)"
      :class="ui?.itemClass?.({ item, index, items })"
      :style="ui?.itemStyle?.({ item, index, items })"
    >
      <slot
        :item
        :index
      />
    </DnDItem>
  </div>
</template>

<style lang="scss" scoped>
.is-disabled {
  @apply opacity-50;
}

.dnd-container {
  &.direction--vertical {
    @apply overflow-y-auto overflow-x-hidden;
  }

  &.direction--horizontal {
    @apply overflow-y-hidden overflow-x-auto;
  }
}
</style>
