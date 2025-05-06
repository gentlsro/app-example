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

  &.is-intermediate {
    @apply rounded-custom outline outline-2 outline-dashed outline-red-200 outline-offset--2;
  }

  &--selected {
    > * {
      @apply outline outline-2 outline-dashed outline-blue-500/65;
    }
  }
}
</style>
