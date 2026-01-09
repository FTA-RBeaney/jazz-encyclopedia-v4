<script setup lang="ts">
  defineProps<{ albums: Array<any> }>();
</script>
<template>
  <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8">
    <NuxtLink v-for="album in albums" :key="album" :to="`/albums/${album.name}`" class="block">
      <NuxtImg
        :src="album.thumbnails?.maxres?.url || album.thumbnails?.default?.url"
        class="aspect-square w-full rounded-lg object-cover"
      />
      <h3 class="mt-2 text-sm font-semibold">{{ album.name }}</h3>
    </NuxtLink>
  </div>
</template>
