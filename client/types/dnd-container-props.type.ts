import type { CSSProperties } from 'vue'
import type { SortableOptions } from "sortablejs"

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
  sortableOptions?: SortableOptions

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
    itemClass?: ClassType

    /**
     * Style to be applied to the items
     */
    itemStyle?: CSSProperties
  }
}