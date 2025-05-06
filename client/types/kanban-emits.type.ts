import type Sortable from "sortablejs"

type KanbanColumn = {
  column: IItem
  items: IItem[]
  sortableInstance: Sortable
}

export type IDragEventPayload = { item?: IItem, columns: KanbanColumn[] }

export type IKanbanEmits = {
  (e: 'drag:start', payload: IDragEventPayload): void
  (e: 'drag:end', payload: IDragEventPayload): void
}