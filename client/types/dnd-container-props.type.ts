import type { CSSProperties } from 'vue'
import type { SortableEvent, SortableOptions } from 'sortablejs'

export type IDndContainerProps = {
  /**
   * The direction in which the items should be draggable
   */
  direction: 'horizontal' | 'vertical'

  /**
   * Whether the container is disabled for interactions
   */
  disabled?: boolean

  /**
   * A function that returns whether the item is selected
   */
  itemSelected?: (item: IItem) => boolean

  /**
   * Items for the DnD
   */
  items: IItem[]

  /**
   * Key of the property that holds the unique identifier of the item
   */
  itemKey?: string

  /**
   * Options to be passed to the `Sortable` instance
   */
  sortableOptions?: Omit<SortableOptions, 'onEnd'> & {
    onEnd?: (ev: SortableEvent) => any | Promise<any>
  }

  /**
   * Visual configuration
   */
  ui?: {
    /**
     * Class to be applied to the container
     */
    containerClass?: ClassType

    /**
     * Style to be applied to the container
     */
    containerStyle?: CSSProperties

    /**
     * Class to be applied to the items
     */
    itemClass?: (payload: {
      item: IItem
      index: number
      items: IItem[]
    }) => ClassType

    /**
     * Style to be applied to the items
     */
    itemStyle?: (payload: {
      item: IItem
      index: number
      items: IItem[]
    }) => CSSProperties
  }
}
