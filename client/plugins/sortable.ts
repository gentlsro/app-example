import Sortable from 'sortablejs'

import { CancelSortPlugin } from '~/functions/sortable-cancel';

export default defineNuxtPlugin(() => {
  Sortable.mount(CancelSortPlugin())
})