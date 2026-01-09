<script setup lang="ts">
  const props = defineProps<{ artistName: string }>();
  const client = useSupabaseClient();

  const { data, error, refresh } = await useAsyncData("user-albums", async () => {
    const { data, error } = await client
      .from("songs")
      .select("*")
      .not("album", "is", null)
      .neq("album", "")
      .not("youtube_id", "is", null)
      .eq("artist", props.artistName)
      .order("album", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    // deduplicate albums based on the album name
    const albumMap = new Map();
    data.forEach((song) => {
      if (!albumMap.has(song.album)) {
        albumMap.set(song.album, song);
      }
    });
    return Array.from(albumMap.values());
  });
</script>

<template>
  <div>
    <div v-if="data?.length === 0" class="p-4">Users have not added any albums yet.</div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8">
      <NuxtLink v-for="album in data" :key="album" :to="`/albums/${album.album}`" class="block">
        <NuxtImg
          :src="
            album.thumbnails?.maxres?.url ||
            album.thumbnails?.default?.url ||
            'https://iili.io/HlHy9Yx.png'
          "
          class="aspect-square w-full rounded-lg object-cover"
        />
        <h3 class="mt-2 text-sm font-semibold">{{ album.album }}</h3>
      </NuxtLink>
    </div>
  </div>
</template>
