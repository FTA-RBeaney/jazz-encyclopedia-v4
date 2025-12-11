<script setup lang="ts">
  const props = defineProps({
    musicians: {
      type: Array,
      default: () => [],
    },
  });

  const columns = [
    {
      data: null,
      title: "Name",
      render: {
        _: "name",
        display: "#name",
      },
    },
    {
      data: "description",
      title: "Description",
    },
    {
      title: "Type",
      data: null,
      render: {
        _: "artist_type",
        display: "#artist_type",
      },
    },
  ];

  const options = {
    dom: "<'flex flex-col lg:flex-row w-full lg:items-start lg:justify-between gap-5 mb-5 lg:pr-1'f><'border rounded-lg't><'flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between pt-3 p-5'li><''p>",
    autoWidth: true,
    responsive: true,
  };
</script>

<template>
  <UiDatatable :data="musicians" :columns="columns" :options="options" class="w-full">
    <template #name="{ cellData }: { cellData: any }">
      <a :href="`/musicians/${cellData.id}`" class="flex items-center">
        <UiAvatar
          :src="
            cellData?.featured_image ||
            cellData?.wiki_data?.thumbnail?.source ||
            cellData?.wiki_data?.originalimage?.source
          "
          alt="Musician Avatar"
          class="mr-2 size-8 rounded-full bg-zinc-100 object-contain"
          :fallback="cellData.name.charAt(0) || '?'"
        />
        <p>{{ cellData.name }}</p>
      </a>
    </template>
    <template #artist_type="{ cellData }: { cellData: any }">
      <div class="flex gap-1">
        <UiBadge variant="outline" class="capitalize">{{ cellData.artist_type }}</UiBadge>
      </div>
    </template>
  </UiDatatable>
</template>

<style scoped>
  th:last-child,
  td:last-child {
    text-align: right;
  }
</style>
