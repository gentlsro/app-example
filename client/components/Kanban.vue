<script setup lang="ts">
import type Sortable from 'sortablejs'

// Types
import type { IKanbanEmits } from '../types/kanban-emits.type'
import type { IKanbanProps } from '../types/kanban-props.type'

// Store
import { kanbanIdKey, useKanbanStore } from '~/stores/kanban.store'

// Components
import type KanbanColumn from './KanbanColumn.vue'

const props = withDefaults(defineProps<IKanbanProps>(), {
  itemKey: 'id',
  columnKey: 'id',
  mapKeyOrFnc: 'columnId',
})

const emits = defineEmits<IKanbanEmits>()

// Utils
const uuid = injectLocal(kanbanIdKey, generateUUID())
provideLocal(kanbanIdKey, uuid)

// Store
const {
  kanbanEl,
  itemKey,
  columnKey,
  items: storeItems,
  columns: storeColumns,
  selection: selectionStore,
  selectionConfig,
  columnsConfig,
  mapKeyOrFnc,
  draggedItem,
  draggedColumn,
  disabledColumnIds,
} = storeToRefs(useKanbanStore())

// Layout
const columnEls = useTemplateRefsList<InstanceType<typeof KanbanColumn>>()
const columns = defineModel<IItem[]>('columns', { required: true })
const items = defineModel<IItem[]>('items', { required: true })

const sortableOptions: Sortable.Options = {
  animation: 150,
  group: 'kanban-columns',
  swapThreshold: 0.75,
  handle: '.handle',
  scroll: false,

  // @ts-expect-error DOM function
  onStart: ev => draggedColumn.value = ev?.item.getItem?.(),
}

syncRef(items, storeItems, { direction: 'both' })
syncRef(columns, storeColumns, { direction: 'both' })
syncRef(toRef(props, 'itemKey'), itemKey, { direction: 'ltr' })
syncRef(toRef(props, 'mapKeyOrFnc'), mapKeyOrFnc, { direction: 'ltr' })
syncRef(toRef(props, 'columnKey'), columnKey, { direction: 'ltr' })
syncRef(toRef(props, 'selection', []), selectionStore, { direction: 'both' })
syncRef(toRef(props, 'selectionConfig'), selectionConfig, { direction: 'ltr' })
syncRef(toRef(props, 'columnsConfig'), columnsConfig, { direction: 'ltr' })
syncRef(toRef(props, 'disabledColumnIds', []), disabledColumnIds, { direction: 'ltr' })

watch(draggedItem, item => {
  const columns = columnEls.value.map(col => col.getKanbanColumn())

  if (item) {
    emits('drag:start', { item, columns })
  } else {
    emits('drag:end', { item, columns })
  }
})
</script>

<template>
  <DnDContainer
    ref="kanbanEl"
    :items="columns"
    class="kanban"
    direction="horizontal"
    :sortable-options
    :item-key="columnKey"
    :ui="{
      containerClass: 'flex gap-2',
      itemClass: () => 'min-w-50 max-w-50 rounded-custom',
    }"
  >
    <template #default="{ item: column }">
      <KanbanColumn
        :ref="columnEls.set"
        :column
        :column-configuration
      >
        <template #header>
          <slot name="column-header" />
        </template>

        <template #item="rowProps">
          <slot
            v-bind="rowProps"
            name="item"
          />
        </template>
      </KanbanColumn>
    </template>
  </DnDContainer>
</template>
