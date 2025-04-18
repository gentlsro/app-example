<script setup lang="ts">

</script>

<template>
  <div
    flex="~ col center gap-10"
    fit
  >
    <Btn label="Gentl button" />

    <div class="bg-red color-white rounded-custom p-x-2">
      UnoCSS included: `bg-red color-white`
    </div>

    <div flex="~ col gap-1">
      <span font="semibold">
        i18n included
      </span>

      <span
        text="caption"
        p="x-2 y-1"
        rounded="custom"
        border="1 ca"
      >
        From layer: {{ $t('general.column', 2) }}
      </span>

      <span
        text="caption"
        p="x-2 y-1"
        rounded="custom"
        border="1 ca"
      >
        {{ $t('fromApp') }}
      </span>
    </div>
  </div>
</template>
