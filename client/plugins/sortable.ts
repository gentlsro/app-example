import Sortable, { MultiDrag } from 'sortablejs'

export default defineNuxtPlugin(() => {
  Sortable.mount(new MultiDrag())
  // Sortable.mount(SortableRevertPlugin)
})
