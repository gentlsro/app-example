import type { ISelection } from "$ui"

// Types
import type { IKanbanProps } from "~/types/kanban-props.type"

// Constants
import { KANBAN_POSITION_GAP } from "~/constants/kanban-position-gap.constant"

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
    const selection = ref<ISelection | undefined>(kanbanProps?.selection)

    const selectionByKey = computed(() => {
      const _selection = Array.isArray(selection.value)
        ? selection.value
        : [selection.value]

      return _selection.reduce((agg, selection) => {
        const key = selectionConfig.value?.selectionKey ?? itemKey.value
        const _itemKey = getItemKey(selection, key)
        agg[_itemKey] = true

        return agg
      }, {} as Record<string, boolean>)
    })

    // Layout
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
      selectionByKey
    }
  })()
}
