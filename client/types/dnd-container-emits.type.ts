export type IDnDContainerEmits = {
  (e: 'update:items', items: IItem[]): void
  (
    e: 'move:item',
    payload: {
      fromIdx?: number
      toIdx?: number
      item: IItem
      items: IItem[]
    }
  ): void
}
