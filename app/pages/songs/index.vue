<script setup lang="ts">
  definePageMeta({
    layout: "admin",
  });

  const isOpen = ref(false);

  const isAuthed = computed(() => {
    const { profile } = useUserStore();
    return !!profile?.id;
  });

  // use useQuery from tanstack/vue-query to fetch latest songs
  const supabase = useSupabaseClient();
  const { useQuery } = await import("@tanstack/vue-query");

  const { data: latestSongs, isLoading } = useQuery({
    queryKey: ["latest-songs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(`*,created_by(*)`)
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

  // create a computed property with a list of artists
  const artists = computed(() => {
    const artistSet = new Set<string>();
    latestSongs.value?.forEach((song) => {
      if (song.artist) {
        artistSet.add(song.artist);
      }
    });
    return Array.from(artistSet);
  });
</script>

<template>
  <UiContainer v-if="isLoading" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else class="h-full max-w-full">
    <ClientOnly>
      <div class="m-6">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-8">
            <UiCard class="resize">
              <UiCardContent>
                <div class="flex items-center justify-between">
                  <div class="space-y-1">
                    <h2 class="text-2xl font-semibold tracking-tight">Latest songs</h2>
                    <p class="text-muted-foreground text-sm">Latest songs added by users</p>
                  </div>
                  <AddSong v-if="isAuthed" button-text="Song" />
                </div>

                <div
                  v-if="latestSongs && latestSongs.length === 0"
                  class="text-muted-foreground py-6 text-center text-sm"
                >
                  No songs found.
                </div>

                <div v-else class="">
                  <UiTable>
                    <UiTableBody>
                      <template v-for="song in latestSongs" :key="song.id">
                        <SongRow :song="song" />
                      </template>
                    </UiTableBody>
                  </UiTable>
                  <!-- <NuxtLink
                v-for="song in latestSongs"
                :key="song.id"
                :to="`/songs/${song.title}`"
                class="flex"
              >
                <NuxtImg
                  v-if="song.thumbnails"
                  :src="song.thumbnails.maxres.url"
                  class="aspect-square w-full rounded-lg object-cover"
                />
                <h3 class="mt-2 text-sm font-semibold">{{ song.title }}</h3>
                <p>{{ song.artist }}</p>
                <p class="text-muted-foreground mt-1 text-xs">
                  {{ song.album }}
                </p>
              </NuxtLink> -->
                </div>
              </UiCardContent>
            </UiCard>
          </div>
          <div class="col-span-4">
            <UiCard class="resize">
              <UiCardContent>
                <div class="flex items-center justify-between">
                  <div class="space-y-1">
                    <h2 class="text-2xl font-semibold tracking-tight">Artists</h2>
                  </div>
                </div>
                <UiTable>
                  <UiTableBody class="last:border-b">
                    <template v-for="artist in artists" :key="artist">
                      <UiTableRow>
                        <UiTableCell class="font-medium">
                          {{ artist }}
                        </UiTableCell>
                      </UiTableRow>
                    </template>
                  </UiTableBody>
                </UiTable>
              </UiCardContent>
            </UiCard>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between">
          <h2 class="text-2xl font-semibold tracking-tight">Albums</h2>
          <NuxtLink to="/albums" class="text-primary hover:underline">View all albums</NuxtLink>
        </div>

        <AlbumGrid :albums="albums" class="mt-4" />
      </div>
    </ClientOnly>
  </UiContainer>
</template>
