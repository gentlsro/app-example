export type IDragMeta = {
   /**
    * The container from which the item is being dragged
    */
   sourceContainerEl?: HTMLElement

   /**
   * Source item element (to get the actual source item, you can use the `draggedItem` from store)
   */
   sourceEl?: HTMLElement

   /**
    * The source item rect
    */
   sourceRect?: DOMRect
 
   /**
    * The taget item element
    */
   targetEl?: HTMLElement
 
   /**
    * The target item
    */
   target?: IItem

   /**
    * The container to which the element is being dragged to
    */
   targetContainerEl?: HTMLElement

   /**
    * The latest position when dragging the item
    */
   latestPosition?: {
      container: HTMLElement
      index: number
   }
}