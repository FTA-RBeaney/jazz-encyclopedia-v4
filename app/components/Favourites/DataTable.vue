<script setup>
  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  });
</script>
<template>
  <UiTable v-if="data" class="py-2">
    <UiTableHeader>
      <UiTableRow class="hover:bg-transparent">
        <UiTableHead>Name</UiTableHead>
        <UiTableHead>Type</UiTableHead>
      </UiTableRow>
    </UiTableHeader>
    <UiTableBody>
      <UiTableRow v-for="(value, key) in data" :key="key">
        <UiTableCell>{{ value.name }}</UiTableCell>
        <UiTableCell>
          <span v-if="value.type === 'song'">
            <Icon name="material-symbols:music-note" />
          </span>
          <span v-if="value.type === 'artist'">
            <Icon name="lucide:user" />
          </span>
          <span v-if="value.type === 'album'">
            <Icon name="material-symbols:album" />
          </span>
          <span v-if="value.type === 'playlist'">
            <Icon name="material-symbols:playlist-add" />
          </span>
          <span v-if="value.type === 'band'">
            <Icon name="material-symbols:group" />
          </span>
          <span v-if="value.type === 'dancer'">
            <Icon name="lucide:user" />
          </span>
          <span v-if="value.type === 'move'">
            <Icon name="lucide:footprints" />
          </span>
          <span v-if="value.type === 'article'">
            <Icon name="lucide:file-text" />
          </span>
          <span v-if="value.type === 'blog'">
            <Icon name="lucide:rss" />
          </span>
          <span v-if="value.type === 'book'">
            <Icon name="lucide:book" />
          </span>
          <span v-if="value.type === 'podcast'">
            <Icon name="material-symbols:mic" />
          </span>
        </UiTableCell>
      </UiTableRow>
    </UiTableBody>
  </UiTable>
</template>
