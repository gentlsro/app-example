<script setup lang="ts">
import { useDnDStore } from '../stores/dnd.store'

type IProps = {
  direction?: 'vertical' | 'horizontal'
  item: IItem
  index: number
  a?: boolean
}

const props = defineProps<IProps>()

const item = defineModel<IItem>('item', { required: true })

// Store
const { listEl } = storeToRefs(useDnDStore())

// Utils
const { createDraggable } = useDnD({ direction: props.direction })

// Layout
const el = useTemplateRef('el')
const { height, width } = useElementSize(el, undefined, { box: 'border-box' })

const s = ref()

useRafFn(() => {
  if (!el.value) {
    return
  }

  const x = getComputedStyle(el.value)
  s.value = x.transform
})

// const moveHandleEl = useTemplateRef('moveHandleEl')

// D'n'D
onMounted(() => {
  nextTick(() => {
    const _el = unrefElement(el as any) as HTMLElement
    const listElDom = unrefElement(listEl as any)

    createDraggable({
      el: _el,
      containerEl: listElDom,
      item: { ref: item.value, index: props.index },
      moveHandleEl: _el,
    })
  })
})
</script>

<template>
  <div
    ref="el"
    class="dnd-item"
    :style="{ '--itemHeight': height, '--itemWidth': width }"
    :class="{ '!min-h-26': a }"
  >
    <slot>
      <span>{{ item.id }} w: {{ width }}</span>
      <!-- <span>{{ s }}</span> -->
      <span text="center" >{{ item.text }}</span>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.dnd-item {
  @apply relative flex flex-col flex-center p-2 bg-black rounded-custom min-h-16 min-w-40;

  will-change: transform;
  transform: translate3d(var(--translate3D, 0, 0, 0));

  &.ghost {
    @apply opacity-50;
  }
}

.dnd.direction--vertical .dnd-item {
  &::before {
    @apply content-empty absolute top-1/4 -translate-y-1/2 w-full h-px bg-blue/20;
  }

  &::after {
    @apply content-empty absolute top-3/4 -translate-y-1/2 w-full h-px bg-red/20;
  }
}

.dnd.direction--horizontal .dnd-item {
  &::before {
    @apply content-empty absolute left-1/4 -translate-x-1/2 w-px h-full bg-blue/20;
  }

  &::after {
    @apply content-empty absolute left-3/4 -translate-x-1/2 w-px h-full bg-red/20;
  }
}
</style>
