<script setup lang="ts">
  definePageMeta({
    layout: "admin",
  });

  // use useQuery from tanstack/vue-query to fetch latest songs
  const supabase = useSupabaseClient();
  const { useQuery } = await import("@tanstack/vue-query");

  const { data: latestSongs, isLoading } = useQuery({
    queryKey: ["latest-songs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .not("youtube_id", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  // create a computed property where each item contains the album name and the thumbnails column
  const albums = computed(() => {
    const albumSet = new Set<string>();
    latestSongs.value?.forEach((song) => {
      if (song.album) {
        albumSet.add(song.album);
      }
    });
    return Array.from(albumSet).map((album) => {
      const song = latestSongs.value?.find((s) => s.album === album);
      return {
        name: album,
        thumbnails: song?.thumbnails,
      };
    });
  });
</script>

<template>
  <UiContainer v-if="isLoading" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else class="h-full max-w-full">
    <ClientOnly>
      <div class="m-6">
        <div class="mt-6 flex items-center justify-between">
          <h2 class="text-2xl font-semibold tracking-tight">User added albums</h2>
        </div>

        <AlbumGrid :albums="albums" class="mt-4" />
      </div>
    </ClientOnly>
  </UiContainer>
</template>
