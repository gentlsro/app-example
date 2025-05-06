// @ts-nocheck
// Taken from: https://github.com/SortableJS/Sortable/issues/138#issuecomment-1114674135

/**
 * Returns the CancelSort Sortable
 * Plugin, to cancel a drag action
 * by hitting the ESC key.
 *
 */
export function CancelSortPlugin() {
  function CancelSort() {
    this.defaults = {
      cancelSort: true,
      revertOnSpill: true,
    }
  }

  CancelSort.prototype = {
    drop({ cancel, dispatchSortableEvent, originalEvent, dragEl, cloneEl }) {
      // // In case the 'ESC' key was hit,
      // // the origEvent is of type 'dragEnd'.
      // if (originalEvent.type === 'dragend') {
      //   // Call revert on spill, to revert the drag
      //   // using the existing algorithm.
      //   this.sortable.revertOnSpill.onSpill({
      //     cancel,
      //     dispatchSortableEvent,
      //     originalEvent,
      //     dragEl,
      //     cloneEl,
      //   })

      //   // Undo changes on the drag element.
      //   if (dragEl) {
      //     // Remove ghost & chosen class.
      //     dragEl.classList.remove(this.options.ghostClass)
      //     dragEl.classList.remove(this.options.chosenClass)
      //     dragEl.removeAttribute('draggable')
      //   }

      //   // In case of a copy, the cloneEl
      //   // has to be removed again.
      //   if (cloneEl) {
      //     cloneEl.remove()
      //   }
      // }

      // Dispatch 'end' event.
      dispatchSortableEvent('end')
    },
  }

  return Object.assign(CancelSort, {
    pluginName: 'cancelSort',
  })
}
