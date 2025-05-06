<script setup lang="ts">
import { faker } from '@faker-js/faker'
import type { SortableOptions } from 'sortablejs';
import { KANBAN_POSITION_GAP } from '~/constants/kanban-position-gap.constant';
import type { IDragEventPayload } from '~/types/kanban-emits.type';


const columns = ref(
  Array.from({ length: 5 }, (_, idx) => ({
    id: idx,
    name: faker.lorem.word(8),
  })),
)

const items = ref(
  Array.from({ length: 15 }, (_, idx) => ({
    id: idx,
    text: faker.lorem.sentence({ min: 1, max: 10 }),
    columnId: idx % 5,
    position: (KANBAN_POSITION_GAP) * idx +KANBAN_POSITION_GAP
  })),
)

const items2 = ref(
  Array.from({ length: 10 }, (_, idx) => ({
    id: idx + 100,
    text: faker.lorem.sentence({ min: 1, max: 20 }),
  })),
)

const sortableOptions: SortableOptions = {
  animation: 150,
  group: 'group1',
  swapThreshold: 0.75,
  ghostClass: 'ghost',
  dragClass: 'drag',
}

const trigger = ref(0)

function handleChangeItem() {
  const item = faker.helpers.arrayElement(items.value)

  item.text = faker.lorem.sentence({ min: 1, max:10 })
}

function addItem() {
  items.value.push({
    id: items.value.length,
    text: faker.lorem.sentence({ min: 1, max: 10 }),
    columnId: items.value.length % 3,
    position: (KANBAN_POSITION_GAP) * items.value.length +KANBAN_POSITION_GAP,
  })
}

function getValidColumns() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([1,2,3])
    }, 5)
  })
}

const disabledColumnIds = ref<number[]>([])

async function handleDragStart(payload: IDragEventPayload) {
  // disabledColumnIds.value = payload.columns.map(col => col.column.id)

  // const validColumns = await getValidColumns() as number[]
  // disabledColumnIds.value = difference(disabledColumnIds.value, validColumns)
}

function handleDragEnd(payload: IDragEventPayload) {
  disabledColumnIds.value = []
}
</script>

<template>
  <PageWrapper :breadcrumbs="false">
    <Btn label="trigger" @click="trigger++" />
    <Btn label="change item" @click="handleChangeItem" />
    <Btn label="add item" @click="addItem" />

    <Kanban
      :key="trigger"
      v-model:columns="columns"
      v-model:items="items"
      :disabled-column-ids
      :selection-config="{ enabled: true }"
      h="150"
      :column-configuration="{
        sortableOptions,
        ui: {
          containerClass: 'flex flex-col rounded-custom',
          itemClass: 'p-t-2 p-x-2 cursor-default bg-purple last:p-b-2 last:rounded-b-custom',
        }
      }"
      @drag:start="handleDragStart"
      @drag:end="handleDragEnd"
    >
      <template #item="{ item }">
        <div flex="~ col gap-1" class="card border-2 border-black rounded-custom p-2 bg-white dark:bg-black">
          <span font="semibold rem-14">
            {{ item.text }}
          </span>
          <span text="caption">
            #{{ item.id }}: {{ item.position }}
          </span>
        </div>
      </template>
    </Kanban>

    <!-- <div flex="~ gap-4" :key="trigger">
      <DnDContainer
        v-model:items="items"
        :ui="{ containerClass: '!p-2 flex flex-col gap-2', itemClass: 'p-2 border-2 border-black rounded-custom cursor-default' }"
        :sortable-options
        >
        <template #default="{ item }">
          <div flex="~ center" text="center">
            {{ item.text }}
          </div>
        </template>
      </DnDContainer>

      <DnDContainer
        v-model:items="items2"
        :ui="{ containerClass: '!p-2 flex flex-col gap-2', itemClass: 'p-2 border-2 border-black rounded-custom cursor-default' }"
        :sortable-options
      >
        <template #default="{ item }">
          <div flex="~ center" text="center">
            {{ item.text }}
          </div>
        </template>
      </DnDContainer>
    </div> -->
  </PageWrapper>
</template>

<style lang="scss" scoped>
:deep(.drag) {
  @apply z-$zMax;
  @apply "!bg-transparent";

  .card {
    @apply rotate-5;
  }
}

:deep(.ghost) {
  .card::after {
    @apply absolute content-empty top-2 left-2 right-2 bottom-0 bg-primary rounded-custom;
  }
}
</style>
