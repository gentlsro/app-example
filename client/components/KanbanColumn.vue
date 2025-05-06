<script setup lang="ts">
// Types
import type { IKanbanProps } from '~/types/kanban-props.type';

// Store
import { useKanbanStore } from '~/stores/kanban.store';

// Constants
import { KANBAN_POSITION_GAP } from '~/constants/kanban-position-gap.constant';
import { faker } from '@faker-js/faker';

type IProps = Pick<IKanbanProps, 'columnConfiguration'> & {
  column: IItem
}

const props = defineProps<IProps>()

// Store
const {
  itemKey,
  draggedItem,
  columns,
  disabledColumnIds,
  columnKey,
  mapKeyOrFnc,
  itemsByColumnId,
  highestItemPosition,
} = storeToRefs(useKanbanStore())

// Layout
const containerEl = useTemplateRef('containerEl')
const column = toRef(props, 'column')

const isDisabled = computed(() => {
  const columnId = get(column.value, columnKey.value)

  return disabledColumnIds.value.includes(columnId)
})

const items = computed(() => {
  return (itemsByColumnId.value[get(column.value, columnKey.value)] ?? [])
    .toSorted((a, b) => a.position - b.position)
})

const sortableOptions = computed(() => {
  return {
    ...props.columnConfiguration?.sortableOptions,
    group: 'kanban-rows',

    // @ts-expect-error DOM function
    onStart: ev => {
      draggedItem.value = ev?.item.getItem?.()

      props.columnConfiguration?.sortableOptions?.onStart?.(ev)
    },

    // @ts-expect-error DOM function
    onEnd: ev => {
      draggedItem.value = undefined

      props.columnConfiguration?.sortableOptions?.onEnd?.(ev)
    },
  }
})

function handleMoveItem(payload: { toIdx?: number, item: IItem }) {
  const { toIdx, item } = payload

  // If there is no `toIdx`, it means that we removed the item from this column
  if (!isNil(toIdx)) {
    let newPosition = 0

    // When there are no items in this column, we set the position to the highest position + gap
    if (!items.value.length) {
      newPosition = highestItemPosition.value + KANBAN_POSITION_GAP
    } else {
      const _containerEl = unrefElement(containerEl) as HTMLElement
      const children = Array.from(_containerEl.children) as HTMLElement[]

      const preceedingChild = children[toIdx - 1] as HTMLElement
      const succeedingChild = children[toIdx + 1] as HTMLElement

      // @ts-expect-error
      const preceedingPosition = preceedingChild?.getItem?.()?.position

      // @ts-expect-error
      const succeedingPosition = succeedingChild?.getItem?.()?.position

      if (isNil(preceedingPosition)) {
        newPosition = Math.round((items.value[0]?.position ?? 0) / 2)
      } else if (isNil(succeedingPosition)) {
        newPosition = (items.value[items.value.length - 1]?.position ?? 0) + KANBAN_POSITION_GAP
      } else {
        newPosition = Math.round((preceedingPosition + succeedingPosition) / 2)
      }
    }

    
    const columnId = get(column.value, columnKey.value)
    const itemColumnIdKey = typeof mapKeyOrFnc.value === 'function'
      ? mapKeyOrFnc.value(item, columns.value)
      : mapKeyOrFnc.value
    
    item.position = newPosition
    item[itemColumnIdKey] = columnId
  }
}

defineExpose({
  getKanbanColumn: () => ({
    column: column.value,
    items: items.value,
    sortableInstance: containerEl.value?.getSortableInstance(),
  })
})
</script>

<template>
  <div class="kanban__column">
    <slot name="header" :column :items>
      <KanbanColumnHeader
        :column
        :items
      />
    </slot>

    <slot name="content" :column :items>
      <DnDContainer
        ref="containerEl"
        :ui="columnConfiguration?.ui"
        :sortable-options
        :items
        :item-key
        :disabled="isDisabled"
        direction="vertical"
        class="kanban__column-content hide-scrollbar"
        @move:item="handleMoveItem"
      >
        <template #default="rowProps">
          <slot name="item" v-bind="rowProps" />
        </template>
      </DnDContainer>
    </slot>

  </div>
</template>

<style lang="scss" scoped>
.kanban__column {
  @apply flex flex-col h-full rounded-custom;

  &-content {
    @apply grow;
  }

  &-placeholder {
    @apply flex flex-center border-2 border-black dark:border-white border-dashed bg-white m-1 p-y-2 rounded-custom dark:bg-black;
  }
}
</style>