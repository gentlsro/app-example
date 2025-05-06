import type { ISelection } from "$ui"
import type { SortableOptions } from "sortablejs"
import type { IDndContainerProps } from "./dnd-container-props.type"

export type IKanbanProps = {
  /**
   * The property of the items that holds unique ID
   * 
   * @default 'id'
   */
  itemKey?: string

   /**
   * The property of the columns that holds unique ID
   * 
   * @default 'id'
   */
   columnKey?: string

  /**
   * Can be either property that connects the item to the column
   * 
   * Example
   * We have an item { id: 1, name: "Some text", columnId: 2 }
   * And column      { id: 2, name: "Some column" }
   * 
   * Then `mapKeyOrFnc` should be `columnId`
   * 
   * 
   * Or it can be a function that returns the `columnId` (the key can be configured via `columnKey`)
   * 
   * @default 'columnId'
   */
  mapKeyOrFnc?: string | ((item: IItem, columns: IItem) => string)

  /**
   * Columns for the Kanban
   */
  columns: IItem[]

  /**
   * The items to show in the Kanban
   */
  items: IItem[]

  /**
   * Configuration for the kanban column content
   */
  columnConfiguration?: Pick<IDndContainerProps, 'sortableOptions' | 'ui'>

  /**
   * Selected items on the Kanban
   */
  selection?: ISelection

  /**
   * The column ids that should be disabled for interactions
   */
  disabledColumnIds?: Array<string | number>

  /**
   * Columns configuration
   */
  columnsConfig?: {
    /**
     * The property that holds the label for the item
     */
    labelKey?: string

    /**
     * A function to resolve the column label
     */
    getLabel?: (column: IItem) => string

    /**
     * The sortable options applied to the columns
     */
    sortableOptions?: SortableOptions
  }

  /**
   * Selection configuration
   */
  selectionConfig?: {
    /**
     * Whether the table rows should be selectable
     */
    enabled?: boolean

    /**
     * If true, when item is selected, only the `itemKey` will be emitted, not
     * the whole item
     */
    emitKey?: boolean

    /**
     * Function that gets called on row select, returrn `false` to prevent the
     * selection from happening
     */
    onSelect?: (payload: {
      row: any
      selection: MaybeRefOrGetter<ISelection>

      /**
       * When true, only given row will should selected, others should be deselected
       */
      isSet?: boolean
    }) => void | false | Promise<void | false>

    /**
     * Selection key
     * The key to use for the selection, defaults to table's `rowKey`
     */
    selectionKey?: string
  }
}