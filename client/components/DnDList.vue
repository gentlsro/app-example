<script setup lang="ts">
import { dndIdKey, useDnDStore } from '../stores/dnd.store'

type IProps = {
  direction?: 'vertical' | 'horizontal'
  items: IItem[]
  itemKey?: string
  a?: boolean
}

withDefaults(defineProps<IProps>(), {
  itemKey: 'id',
})

// Utils
const uuid = injectLocal(dndIdKey, useId()) as string

// Store
const { listEl, items: storeItems } = storeToRefs(useDnDStore({ dndId: uuid }))

// Layout
const items = defineModel<IItem[]>('items', { required: true })
const { x, y } = useElementBounding(listEl)

syncRef(items, storeItems, { direction: 'both' })

provideLocal(dndIdKey, uuid)
</script>

<template>
  <ScrollArea
    ref="listEl"
    class="dnd"
    :class="`direction--${direction}`"
    :style="{ '--containerY': y, '--containerX': x }"
  >
    <DnDItem
      v-for="(item, index) in items"
      :key="item.id"
      :data-id="item.id"
      :data-idx="index"
      :a
      :item
      :index
      :direction
    >
      <slot
        name="item"
        :item
        :index
      />
    </DnDItem>
  </ScrollArea>
</template>

<style lang="scss" scoped>
.dnd {
  @apply flex p-2 overflow-auto select-none gap-2 overflow-auto;

  &.direction--vertical {
    @apply flex-col overflow-x-visible;
  }

  &.direction--horizontal {
    @apply overflow-y-hidden;
  }

  &.drag-source {
    @apply absolute inset-0;
  }
}
</style>
