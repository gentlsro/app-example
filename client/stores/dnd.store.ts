// Types
import type { IDragMeta } from "~/types/drag-meta.type"
import type { IDraggedItem } from "~/types/dragged-item.type"

export const dndIdKey = Symbol('__dndId')

export function useDnDStore(payload?: { dndId?: string }) {
  const { dndId } = payload ?? {}
  const _dndId = injectLocal(dndIdKey, dndId ?? useId())

  return defineStore(`dnd.${_dndId}`, () => {
    // Elements
    const listEl = ref<HTMLDivElement>()

    // Layout
    const items = ref<IItem[]>([])
    const draggedItem = ref<IDraggedItem>()
    const dragMeta = ref<IDragMeta>({
      sourceEl: undefined,
      targetEl: undefined,
      target: undefined,
    })

    return {
      listEl,
      items,
      draggedItem,
      dragMeta,
    }
  })()
}
