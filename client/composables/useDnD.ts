// @unocss-include

import { autoScrollPlugin, Draggable, PointerSensor, type PointerSensorMoveEvent } from 'dragdoll'
import { useDnDStore } from '~/stores/dnd.store'
import type { IDraggedItem } from '~/types/dragged-item.type'

const DND_ITEM_CLASSES = ['dnd-item']

export function useDnD() {
  // Store
  const { items, listEl, draggedItem, dragMeta } = storeToRefs(useDnDStore())

  // Utils
  const direction: 'vertical' | 'horizontal' = 'vertical'
  let gap = 0
  let lastY = 0
  const { x, y } = useSharedMouse()

  function handleDragStart(payload: { item: IDraggedItem, el: HTMLElement }) {
    // Get the list padding top to calculate the correct position of drop indicator
    const listElDom = unrefElement(listEl as any) as HTMLElement
    
    // Get gap for the list
    const listGap = getComputedStyle(listElDom)
    gap = Number.parseFloat(direction === 'vertical' ? listGap.rowGap : listGap.columnGap)

    // if (listElDom) {
    //   const listPaddingTop = getComputedStyle(listElDom).paddingTop

    //   dragMeta.value.dropIndicatorCSS = { top: listPaddingTop }
    // }

    draggedItem.value = payload.item
    dragMeta.value = {
      ...dragMeta.value,
      sourceRect: payload.el.getBoundingClientRect(),
      sourceEl: payload.el as HTMLElement,
    }

    // if (listElDom) {
    //   const items = listElDom.querySelectorAll('.virtual-scroll__row') as NodeListOf<HTMLElement>

    //   items.forEach(item => {
    //     item.style.transition = 'transform 125ms linear'
    //     item.style.setProperty('--translate3D', '0, 0, 0')
    //   })
    // }
  }

  function handleDragMove(ev: Pick<PointerSensorMoveEvent, 'x' | 'y' | 'target'>, delta = 0) {
    const { x, y, target } = ev
    lastY = y
    const elements = document.elementsFromPoint(x, y)
    const listElDom = unrefElement(listEl as any) as HTMLElement

    const draggedOverItem = elements.find(el => {
      return DND_ITEM_CLASSES.some(cls => el.classList.contains(cls))
    }) as HTMLElement

    // // If we're over a previous item, we don't do anything
    const draggedOverItemId = draggedOverItem?.dataset.id
    const isDraggedOverSameItem = draggedOverItemId === dragMeta.value?.target?.id
    const isSelf = draggedOverItemId === String(draggedItem.value?.ref?.id)

    const {
      y: draggedOverItemY,
      height: draggedOverItemHeight,
      x: draggedOverItemX,
      width: draggedOverItemWidth,
    } = draggedOverItem?.getBoundingClientRect() ?? {}

    let isBefore = false

    if (direction === 'vertical') {
      isBefore = y <= (draggedOverItemY + draggedOverItemHeight / 2)

      if (delta) {
        const isMovingUp = delta < 0

        if (isMovingUp && !isBefore) {
          isBefore = y <= (draggedOverItemY + draggedOverItemHeight / 4 * 3)
        } else if (!isMovingUp && isBefore) {
          isBefore = y <= (draggedOverItemY + draggedOverItemHeight / 4)
        }
      }
    }

    else if (direction === 'horizontal') {
      isBefore = x <= (draggedOverItemX + draggedOverItemWidth / 2)

      if (delta) {
        const isMovingLeft = delta < 0

        if (isMovingLeft && !isBefore) {
          isBefore = x <= (draggedOverItemX + draggedOverItemWidth / 4 * 3)
        } else if (!isMovingLeft && isBefore) {
          isBefore = x <= (draggedOverItemX + draggedOverItemWidth / 4)
        }
      }
    }

    const isSame = isDraggedOverSameItem
    const t = (target as HTMLElement).classList.contains('dnd-item')
      ? (target as HTMLElement)
      : (target as HTMLElement).closest('.dnd-item') as HTMLElement
    const targetIdxString = t?.getAttribute('data-idx')
    
    if (!t || isNil(targetIdxString)) {
      return
    }

    const targetIdx = Number(targetIdxString)
    

    if (isSelf || isSame || !draggedOverItem || !draggedItem.value) {
      return
    }

    requestAnimationFrame(() => {
      // Otherwise, we animate the changes through the translate3d property
      if (!isNil(draggedItem.value?.index)) {
        let moveSelf = 0
        const { height: sourceH = 0, width: sourceW = 0 } = dragMeta.value.sourceRect ?? {}

        // Moving up / left
        if (targetIdx < draggedItem.value!.index) {
          const [idxStart, idxEnd] = [isBefore ? targetIdx : targetIdx + 1, draggedItem.value!.index]

          items.value.forEach((item, idx) => {
            const isPreceedingItem = idx >= idxStart && idx < idxEnd
            const el = listElDom.querySelector(`[data-id="${item.id}"]`) as HTMLElement

            if (isPreceedingItem && el) {
              if (direction === 'vertical') {
                el.style.setProperty('--translate3D', `0, ${sourceH + gap}px, 0`)
              } else {
                el.style.setProperty('--translate3D', `${sourceW + gap}px, 0, 0`)
              }

              const computedStyle = getComputedStyle(el)
              const elSize = direction === 'vertical'
                ? +computedStyle.getPropertyValue('--itemHeight')
                : +computedStyle.getPropertyValue('--itemWidth')

              moveSelf -= (elSize + gap)
            } else if (el) {
              el.style.setProperty('--translate3D', '0, 0, 0')
            }
          })
        }

        // Moving down / right
        else {
          // console.log('Moving right')
          const [idxStart, idxEnd] = [draggedItem.value!.index + 1, isBefore ? targetIdx : targetIdx + 1]

          items.value.forEach((item, idx) => {
            const isFollowingItem = idx >= idxStart && idx < idxEnd
            const el = listElDom.querySelector(`[data-id="${item.id}"]`) as HTMLElement

            if (isFollowingItem && el) {
              if (direction === 'vertical') {
                el.style.setProperty('--translate3D', `0, -${sourceH + gap}px, 0`)
              } else {
                el.style.setProperty('--translate3D', `-${sourceW + gap}px, 0, 0`)
              }

              const computedStyle = getComputedStyle(el)
              const elSize = direction === 'vertical'
                ? +computedStyle.getPropertyValue('--itemHeight')
                : +computedStyle.getPropertyValue('--itemWidth')

              moveSelf += (elSize + gap)
            } else if (el) {
              el.style.setProperty('--translate3D', '0, 0, 0')
            }
          })
        }

        // Move the item itself
        const selfDom = listElDom.querySelector(`[data-id="${draggedItem.value?.ref?.id}"]`) as HTMLElement

        if (selfDom) {
          if (direction === 'vertical') {
            selfDom.style.setProperty('--translate3D', `0, ${moveSelf}px, 0`)
          } else {
            selfDom.style.setProperty('--translate3D', `${moveSelf}px, 0, 0`)
          }
        }
      }

      dragMeta.value.targetEl = t
      dragMeta.value.target = items.value?.find(item => String(item.id) === String(draggedOverItem.dataset.id))
    })
  }

  function handleDragEnd(drag?: Draggable['drag']) {
    const dragItem = drag?.items[0]

    // Remove the ghost element
    dragItem?.element.remove()

    // const targetId = dragMeta.value.target?.id
    // const fromIdx = items.value.findIndex(item => {
    //   return getListItemKey(item, itemKey.value) === draggedItem.value?.ref?.id
    // })

    // let toIdx = items.value.findIndex(item => {
    //   return getListItemKey(item, itemKey.value) === targetId
    // })

    // // We need to adjust the `toIdx` based on the direction and placement
    // const isMovedUp = toIdx < fromIdx

    // if (isMovedUp && dragMeta.value.placement === 'below') {
    //   toIdx = toIdx + 1
    // } else if (!isMovedUp && dragMeta.value.placement === 'above') {
    //   toIdx = toIdx - 1
    // }

    // if (drag && !!dragMeta.value.target?.id) {
    //   items.value = moveItem(items.value, fromIdx, toIdx)
    //   emits.value.itemMoved(draggedItem.value!.ref, items.value)
    // }

    // // Reset dragging
    // draggedItem.value = undefined
    // dragMeta.value = {
    //   targetEl: undefined,
    //   target: undefined,
    //   placement: undefined,
    //   dropIndicatorCSS: undefined,
    //   sourceEl: undefined,
    // }

    const listElDom = unrefElement(listEl as any) as HTMLElement

    if (listElDom) {
      const items = listElDom.querySelectorAll('.dnd-item') as NodeListOf<HTMLElement>

      items.forEach(item => {
        item.style.transition = ''
        item.style.setProperty('--translate3D', '0, 0, 0')
      })
    }
  }

  function createClone(el: HTMLElement) {
    const elemRect = el.getBoundingClientRect()
    const clone = el.cloneNode(true) as HTMLElement
    clone.style.zIndex = '9999'
    clone.style.position = 'fixed'
    clone.style.width = `${elemRect.width}px`
    clone.style.height = `${elemRect.height}px`
    clone.style.left = `${elemRect.left}px`
    clone.style.top = `${elemRect.top}px`

    // Add the ghost and dragging class to the clone. The ghost element will be
    // in dragging state for the duration of it's existence.
    clone.classList.add('ghost', 'dragging', 'pointer-events-none')

    // We need to reset the transform to avoid the ghost element being offset
    // unintentionally. In this specific case, if we don't reset the transform,
    // the ghost element will be offset by the original element's transform.
    clone.style.transform = ''

    // Append the ghost element to the body.
    document.body.appendChild(clone)

    return clone
  }

  function handleScroll() {
    requestAnimationFrame(() => {
      handleDragMove({
        x: x.value,
        y: y.value,
        target: document.elementFromPoint(x.value, y.value),
      })
    })
  }

  function createDraggable(payload: {
    el: HTMLElement
    item: IDraggedItem
    containerEl: HTMLElement
    moveHandleEl: HTMLElement
  }) {
    const { el, containerEl, moveHandleEl, item } = payload

    const pointerSensor = new PointerSensor(moveHandleEl)
    const draggable = new Draggable([pointerSensor], {
      elements: () => {
        // const listElDom = unrefElement(listEl as any) as HTMLElement
        // dragMeta.value.isVirtualScroll = !!listElDom?.classList.contains('is-virtual')
        const clone = createClone(el)
        clone.classList.add('opacity-50')

        return [clone]
      },
      frozenStyles: () => ['left', 'top'],
      onStart: drag => {
        lastY = drag.startEvent.y
        // const item = listItems.value.find(item => item.id === itemId) as IListItem
        containerEl.addEventListener('scroll', handleScroll)
        containerEl.classList.add('hide-scrollbar')

        handleDragStart({ item, el })
      },
      onMove: drag => handleDragMove(drag.moveEvent as PointerSensorMoveEvent, drag.moveEvent.y - lastY),
      onEnd: drag => {
        containerEl.removeEventListener('scroll', handleScroll)
        containerEl.classList.remove('hide-scrollbar')

        handleDragEnd(drag)
      },
    }).use(autoScrollPlugin({
      speed: (_, { distance, threshold }) => {
        const x = Math.min(threshold, threshold - distance) / threshold

        return x * 450
      },
      targets: [
        {
          element: containerEl,
          axis: 'x',
          padding: { left: Infinity, right: Infinity },
          threshold: 50,
        },
      ],
    }))

    return draggable
  }

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    createClone,
    createDraggable,
  }
}
