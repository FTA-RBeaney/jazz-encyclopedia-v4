<script setup>
  import { nextTick, ref, watch } from "vue";

  const props = defineProps({
    song: {
      type: Object,
      required: true,
    },
  });

  const sbUser = useSupabaseUser();

  const isOpen = ref(false);
  const videoPlayerRef = ref(null);
  const isCreator = computed(() => {
    return sbUser.value?.sub === props.song.created_by?.id;
  });

  // Watch for sheet open and trigger playback
  watch(isOpen, async (open) => {
    if (open) {
      await nextTick();
      if (videoPlayerRef.value && videoPlayerRef.value.play) {
        videoPlayerRef.value.play();
      }
    }
  });
</script>

<template>
  <UiTableRow>
    <UiTableCell class="font-medium">
      <UiSheet v-model:open="isOpen">
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
                  ref="videoPlayerRef"
                  :key="song.youtube_id"
                  :video="`https://www.youtube.com/watch?v=${song.youtube_id}`"
                  :posterImage="song.thumbnails?.maxres?.url || song.thumbnails?.default?.url"
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
                <UiInput id="artist" :model-value="song.artist" class="col-span-3" />
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
                <UiButton variant="outline" @click="isOpen = false">Close</UiButton>
                <UiButton>Save changes</UiButton>
              </div>
            </UiSheetFooter>
          </template>
        </UiSheetContent>
      </UiSheet>
    </UiTableCell>
    <UiTableCell>{{ song.artist }}</UiTableCell>
    <UiTableCell>{{ song.album }}</UiTableCell>
  </UiTableRow>
</template>
