import type { DnDContainer } from '#components'
import Sortable from 'sortablejs'

// Types
import type { IKanbanProps } from '../types/kanban-props.type'
import type { IKanbanSelection } from '../types/kanban-selection.type'

// Constants
import { KANBAN_POSITION_GAP } from '../constants/kanban-position-gap.constant'

export const kanbanIdKey = Symbol('__kanbanId')

function getItemKey(itemOrId: any, itemKey: string): string {
  return typeof itemOrId === 'object' ? get(itemOrId, itemKey) : itemOrId
}

export function useKanbanStore(payload?: { kanbanId?: string, kanbanProps?: IKanbanProps }) {
  const { kanbanProps, kanbanId } = payload ?? {}
  const _kanbanId = injectLocal(kanbanIdKey, kanbanId ?? useId())

  return defineStore(`kanban.${_kanbanId}`, () => {
    // Utils
    const itemKey = ref(kanbanProps?.itemKey ?? 'id')
    const columnKey = ref(kanbanProps?.columnKey ?? 'id')
    const mapKeyOrFnc = ref(kanbanProps?.mapKeyOrFnc ?? 'columnId')

    // Columns
    const draggedColumn = ref<IItem>()
    const columns = ref(kanbanProps?.columns ?? [])
    const disabledColumnIds = ref(kanbanProps?.disabledColumnIds ?? [])

    // Items
    const draggedItem = ref<IItem>()
    const items = ref<IItem[]>(kanbanProps?.items ?? [])

    const highestItemPosition = computed(() => {
      return items.value.toSorted((a, b) => b.position - a.position)[0]?.position ?? KANBAN_POSITION_GAP
    })

    // Configurations
    const selectionConfig = ref<IKanbanProps['selectionConfig']>(kanbanProps?.selectionConfig)
    const columnsConfig = ref<IKanbanProps['columnsConfig']>(kanbanProps?.columnsConfig)

    // Selection
    const selection = ref<IKanbanSelection[]>(kanbanProps?.selection ?? [])

    const selectionByKey = computed(() => {
      return selection.value.reduce((agg, selection) => {
        agg[selection.itemId] = true

        return agg
      }, {} as Record<string, boolean>)
    })

    function toggleItemSelection(payload: {
      item: IItem
      el?: HTMLElement
      value?: boolean

      /**
       * When true, the method will use the `Sortable.utils.(de)select` method
       * to select/deselect the item in the Sortable instance
       */
      useSortableSelect?: boolean
    }) {
      const { item, el, value, useSortableSelect } = payload

      const {
        onSelect,
      } = selectionConfig.value ?? {}

      const _itemKey = itemKey.value
      const itemId = getItemKey(item, _itemKey)

      const selectionIdx = selection.value.findIndex(selectionItem => {
        return itemId === selectionItem.itemId
      })

      // @ts-expect-error too complex type
      const _kanbanEl = unrefElement(kanbanEl) as HTMLElement
      const itemEl = el ?? _kanbanEl?.querySelector(`.kanban__column .dnd-item[data-id="${itemId}"]`) as HTMLElement

      // Add item to selection
      if (selectionIdx === -1 && value) {
        const isSelectable = onSelect?.({ item, selection })

        if (isSelectable === false && itemEl) {
          Sortable.utils.deselect(itemEl)
        }

        selection.value = [
          ...selection.value,
          { item, itemId, itemEl },
        ]

        if (useSortableSelect && itemEl) {
          Sortable.utils.select(itemEl)
        }
      }

      // Remove item from selection
      else if (selectionIdx !== -1 && !value) {
        selection.value = selection.value.filter((_, idx) => idx !== selectionIdx)

        if (useSortableSelect && itemEl) {
          Sortable.utils.deselect(itemEl)
        }
      }
    }

    // Layout
    const kanbanEl = ref<InstanceType<typeof DnDContainer>>()

    const itemsByColumnId = computed<Record<string, IItem[]>>(() => {
      return items.value.reduce((agg, item) => {
        const itemColumnIdKey = typeof mapKeyOrFnc.value === 'function'
          ? mapKeyOrFnc.value(item, columns.value)
          : mapKeyOrFnc.value

        const itemColumnId = item[itemColumnIdKey]

        if (agg[itemColumnId] === undefined) {
          agg[itemColumnId] = []
        }

        agg[itemColumnId].push(item)

        return agg
      }, {} as Record<string, IItem[]>)
    })

    return {
      // Layout
      kanbanEl,

      // Utils
      itemKey,
      columnKey,
      mapKeyOrFnc,
      highestItemPosition,
      getItemKey,

      // Columns
      draggedColumn,
      columns,
      disabledColumnIds,

      // Items
      draggedItem,
      items,
      itemsByColumnId,

      // Configurations
      columnsConfig,
      selectionConfig,

      // Selection
      selection,
      selectionByKey,
      toggleItemSelection,
    }
  })()
}
