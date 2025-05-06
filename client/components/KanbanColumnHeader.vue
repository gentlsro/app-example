<script setup lang="ts">
// Store
import Sortable from 'sortablejs'
import { useKanbanStore } from '~/stores/kanban.store'

type IProps = {
  column: IItem
  items: IItem[]
}

defineProps<IProps>()

// Store
const kanbanStore = useKanbanStore()
const {
  itemKey,
  itemsByColumnId,
  selectionByKey,
  columnsConfig,
  selectionConfig,
} = storeToRefs(kanbanStore)

// Layout
const column = defineModel<IProps['column']>('column', { required: true })
const items = defineModel<IProps['items']>('items', { required: true })

const itemKeys = computed(() => {
  return items.value.map(item => kanbanStore.getItemKey(item, itemKey.value))
})

const selectionState = computed(() => {
  const isSomeSelected = itemKeys.value.some(rowKey => {
    return selectionByKey.value[rowKey]
  })

  if (!isSomeSelected) {
    return false
  }

  const isAllSelected = itemKeys.value.every(rowKey => {
    return selectionByKey.value[rowKey]
  })

  return isAllSelected ? true : null
})

const columnTitle = computed(() => {
  return typeof columnsConfig.value?.getLabel === 'function'
    ? columnsConfig.value.getLabel(column.value)
    : get(column.value, columnsConfig.value?.labelKey ?? 'name')
})

function handleSelection(value: boolean) {
  itemsByColumnId.value?.[column.value.id]?.forEach(item => {
    kanbanStore.toggleItemSelection({
      item,
      useSortableSelect: true,
      value,
    })
  })
}
</script>

<template>
  <div
    class="kanban-column__header"
    :class="{ 'gap-2': !selectionConfig?.enabled }"
  >
    <!-- Reorder -->
    <div class="i-akar-icons:drag-vertical handle" />

    <!-- Selection -->
    <slot name="selection">
      <Checkbox
        v-if="selectionConfig?.enabled"
        :model-value="selectionState"
        @update:model-value="handleSelection"
      />
    </slot>

    <!-- Title -->
    <h6
      grow
      truncate
    >
      {{ columnTitle }}
      {{ column.id }}
    </h6>

    <!-- Actions -->
    <slot name="actions" />
  </div>
</template>

<style lang="scss" scoped>
.kanban-column__header {
  @apply flex items-center p-1;

  .handle {
    @apply w-4 w-4 shrink-0 cursor-ew-resize;
  }
}
</style>
