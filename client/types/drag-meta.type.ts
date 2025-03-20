export type IDragMeta = {
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
}