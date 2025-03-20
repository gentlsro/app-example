<script setup lang="ts">
import { faker } from '@faker-js/faker'

const items = ref<IItem[]>(
  Array.from({ length: 10 }, (_, idx) => ({
    id: idx,
    text: faker.lorem.sentence({ min: 1, max: 2 }),
  })),
)

const items2 = ref<IItem[]>(
  Array.from({ length: 10 }, (_, idx) => ({
    id: idx + 20,
    text: faker.lorem.sentence({ min: 1, max: 2 }),
  })),
)
</script>

<template>
  <PageWrapper>
    <div flex="~ gap-4" class="h-150 overflow-auto" relative>
      <DnDList :items direction="vertical" a />
      <DnDList :items="items2" direction="vertical" />
    </div>
  </PageWrapper>
</template>
