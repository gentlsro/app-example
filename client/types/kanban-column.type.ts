import type Sortable from 'sortablejs'

export type IKanbanColumn = {
  column: IItem
  items: IItem[]
  sortableInstance?: Sortable
}
