// Types
import type { IKanbanColumn } from './kanban-column.type'

export type IDragEventPayload = {
  item?: IItem
  columns: IKanbanColumn[]
}

export type IKanbanEmits = {
  (e: 'drag:start', payload: IDragEventPayload): void
  (e: 'drag:end', payload: IDragEventPayload): void
}
