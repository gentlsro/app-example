<script setup lang="ts">
import { dndIdKey, useDnDStore } from '../stores/dnd.store'

type IProps = {
  items: IItem[]
  itemKey?: string
}

const props = withDefaults(defineProps<IProps>(), {
  itemKey: 'id',
})

// Utils
const uuid = injectLocal(dndIdKey, useId()) as string

// Store
const { listEl, items: storeItems } = storeToRefs(useDnDStore({ dndId: uuid }))

// Layout
const items = defineModel<IItem[]>('items', { required: true })

syncRef(items, storeItems, { direction: 'both' })

provideLocal(dndIdKey, uuid)
</script>

<template>
  <div
    ref="listEl"
    class="dnd"
  >
    <DnDItem
      v-for="(item, index) in items"
      :key="item.id"
      :data-id="item.id"
      :data-idx="index"
      :item
      :index
    >
      <slot
        name="item"
        :item
        :index
      />
    </DnDItem>
  </div>
</template>

<style lang="scss" scoped>
.dnd {
  @apply flex p-2 overflow-auto select-none gap-2;
}
</style>
