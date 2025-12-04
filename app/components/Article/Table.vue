<script setup lang="ts">
  const props = defineProps({
    articles: {
      type: Array,
      default: () => [],
    },
  });

  const columns = [
    {
      data: null,
      title: "Title",
      render: {
        _: "title",
        display: "#title",
      },
    },
    {
      data: "author",
      title: "Author",
    },
    {
      title: "Tags",
      data: null,
      render: {
        _: "tags",
        display: "#tags",
      },
    },
  ];

  const options = {
    dom: "<'flex flex-col lg:flex-row w-full lg:items-start lg:justify-between gap-5 mb-5 lg:pr-1'f><'border rounded-lg't><'flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between pt-3 p-5'li><''p>",
    select: true,
    autoWidth: true,
    responsive: true,
  };
</script>

<template>
  <UiDatatable :data="articles" :columns="columns" :options="options" class="w-full">
    <template #title="{ cellData }: { cellData: any }">
      <UiHoverCard>
        <UiHoverCardTrigger as-child>
          <div>
            <p>{{ cellData.title }}</p>
          </div>
        </UiHoverCardTrigger>
        <UiHoverCardContent class="w-[300px]">
          <div class="group relative flex h-full w-full flex-col justify-end overflow-hidden">
            <div
              class="relative h-[40%] w-full rounded-t-2xl bg-white p-2 text-slate-800 transition-all group-hover:h-[50%]"
            >
              <p class="text-xs">
                {{ cellData.description }}
              </p>
            </div>
          </div>
        </UiHoverCardContent>
      </UiHoverCard>
    </template>
    <template #tags="{ cellData }: { cellData: any }">
      <div class="flex gap-1">
        <UiBadge v-for="tag in cellData.tags" :key="tag">{{ tag }}</UiBadge>
      </div>
    </template>
  </UiDatatable>
</template>
