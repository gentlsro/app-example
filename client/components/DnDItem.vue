<script setup lang="ts">
type IProps = {
  item: IItem
}

defineProps<IProps>()
</script>

<template>
  <div class="dnd-item" .getItem="() => item">
    <slot>
      {{ item }}
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.dnd-item {
  @apply relative;
}
</style>