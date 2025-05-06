<script setup lang="ts">
type IProps = {
  item: IItem
  selected?: boolean
}

defineProps<IProps>()

function handlePointerUp(ev: PointerEvent) {
  // This might be necesssary for `multiDrag`
  // const isDragging = !!document.querySelector('.dnd-item.drag')

  // if (!isDragging) {
  //   ev.preventDefault()
  //   ev.stopPropagation()
  // }
}
</script>

<template>
  <div
    class="dnd-item"
    :class="{ 'dnd-item--selected': selected }"
    .getItem="() => item"
    @pointerup="handlePointerUp"
  >
    <slot>
      {{ item }}
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.dnd-item {
  @apply relative;

  &--selected {
    > * {
      @apply outline outline-2 outline-blue-500;
    }
  }
}
</style>
