<script setup lang="ts">
  definePageMeta({
    layout: "admin",
  });

  // get all of the songs where the column album matches the slug parameter
  const supabase = useSupabaseClient();
  const route = useRoute();
  const openSongId = ref<string | null>(null);

  const { useQuery } = await import("@tanstack/vue-query");

  const { data: songs, isLoading } = useQuery({
    queryKey: ["album", route.params.slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(`*,created_by(*)`)
        .eq("album", route.params.slug);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  const convertDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
</script>

<template>
  <UiContainer v-if="isLoading" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else class="h-full max-w-full">
    <div class="m-6">
      <h1 class="text-md mb-6 font-semibold">{{ route.params.slug }}</h1>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3 grid gap-2">
          <UiCard class="m-0 p-0">
            <UiCardContent class="relative m-0 aspect-16/6 max-h-96 p-0">
              <img
                :src="
                  (songs && songs[0]?.thumbnails?.maxres?.url) ||
                  (songs && songs[0]?.thumbnails?.default?.url)
                "
                class="aspect-square object-cover"
              />
            </UiCardContent>
          </UiCard>
        </div>

        <div class="col-span-9">
          <UiCard>
            <UiCardContent>
              <UiTable>
                <UiTableHeader>
                  <UiTableRow>
                    <UiTableCell>Song Title</UiTableCell>
                    <UiTableCell>Duration</UiTableCell>
                  </UiTableRow>
                </UiTableHeader>
                <UiTableBody>
                  <UiTableRow v-for="song in songs" :key="song.id">
                    <UiTableCell class="font-medium">
                      <UiSheet
                        :open="openSongId === song.id"
                        @update:open="(v) => (openSongId = v ? song.id : null)"
                      >
                        <UiSheetTrigger as-child>
                          <div class="flex items-center gap-2 hover:cursor-pointer">
                            <NuxtImg
                              :src="song.thumbnails.maxres.url || 'https://iili.io/HlHy9Yx.png'"
                              class="aspect-square w-8 rounded-lg object-cover"
                            />
                            {{ song.title }}
                          </div>
                        </UiSheetTrigger>

                        <UiSheetContent
                          class="sm:max-w-none md:w-[450px]"
                          side="right"
                          title="Edit song"
                          description="Make changes to your song here. Click save when you're done."
                        >
                          <template #content>
                            <div class="grid gap-4 p-4">
                              <div>
                                <NuxtImg
                                  v-if="song.thumbnails"
                                  :src="song.thumbnails.maxres.url"
                                  class="mx-auto mb-2 aspect-square w-44 rounded-lg object-cover"
                                />
                                <VideoPlayer
                                  v-if="song.youtube_id"
                                  :key="song.youtube_id"
                                  :video="`https://www.youtube.com/watch?v=${song.youtube_id}`"
                                  :posterImage="
                                    song.thumbnails?.maxres?.url || song.thumbnails?.default?.url
                                  "
                                  autoplay
                                  view-type="audio"
                                />
                              </div>
                              <div class="grid grid-cols-4 items-center gap-4">
                                <UiLabel for="name" class="text-right"> Name </UiLabel>
                                <UiInput id="name" :model-value="song.title" class="col-span-3" />
                              </div>
                              <div class="grid grid-cols-4 items-center gap-4">
                                <UiLabel for="artist" class="text-right"> Artist </UiLabel>
                                <UiInput
                                  id="artist"
                                  :model-value="song.artist"
                                  class="col-span-3"
                                />
                              </div>
                              <div class="grid grid-cols-4 items-center gap-4">
                                <UiLabel for="album" class="text-right"> Album </UiLabel>
                                <UiInput id="album" :model-value="song.album" class="col-span-3" />
                              </div>
                              <div class="grid grid-cols-4 items-center gap-4">
                                <UiLabel for="youtube_id" class="text-right"> YouTube ID </UiLabel>
                                <UiInput
                                  id="youtube_id"
                                  :model-value="song.youtube_id"
                                  :disabled="!isCreator"
                                  class="col-span-3"
                                />
                              </div>
                              <div class="grid grid-cols-4 items-center gap-4">
                                <UiLabel for="created_by" class="text-right">Added by</UiLabel>
                                <UiInput
                                  id="created_by"
                                  disabled
                                  :model-value="song.created_by?.first_name"
                                  class="col-span-3"
                                />
                              </div>

                              <AddFavourite :post-id="song.id" type="song" :name="song.title" />
                            </div>
                          </template>
                          <template #footer>
                            <UiSheetFooter>
                              <div class="grid grid-cols-2 gap-4">
                                <UiButton variant="outline" @click="openSongId = null"
                                  >Close</UiButton
                                >
                                <UiButton>Save changes</UiButton>
                              </div>
                            </UiSheetFooter>
                          </template>
                        </UiSheetContent>
                      </UiSheet>
                    </UiTableCell>
                    <UiTableCell>{{ convertDuration(song.duration_seconds) }}</UiTableCell>
                  </UiTableRow>
                </UiTableBody>
              </UiTable>
            </UiCardContent>
          </UiCard>
        </div>
      </div>
    </div>
  </UiContainer>
</template>

<style scoped>
  .font-jost {
    font-family: "Jost", sans-serif;
    font-display: optional;
    font-optical-sizing: auto;
    font-weight: 800;
    font-style: normal;
    text-transform: uppercase !important;
    letter-spacing: 1px;
  }
</style>
