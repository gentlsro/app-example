<script setup lang="ts">
import { faker } from '@faker-js/faker'

const items = ref<IItem[]>(
  Array.from({ length: 10 }, (_, idx) => ({
    id: idx,
    text: faker.lorem.sentence({ min: 1, max: 2 }),
  })),
)
</script>

<template>
  <PageWrapper>
    <DnDList :items direction="horizontal" />
  </PageWrapper>
</template>
