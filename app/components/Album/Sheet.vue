<script setup>
  const props = defineProps({
    albumId: {
      type: String,
      required: true,
    },
  });

  const discogsData = ref({});

  const isOpen = ref(false);
  const isPending = ref(false);

  watch(isOpen, async (open) => {
    if (open) {
      const {
        data,
        error,
        pending: discogsPending,
      } = await useAsyncData("discogs-release" + props.albumId, async () => {
        isPending.value = true;
        return await $fetch(`/api/discogs/release/${props.albumId}`).then((data) => {
          isPending.value = false;
          discogsData.value = data;
          return data;
        });
      });
    }
  });
</script>

<template>
  <div class="flex w-full justify-center">
    <UiSheet v-model:open="isOpen">
      <UiButton variant="outline" @click="isOpen = true">Details</UiButton>

      <UiSheetContent
        side="right"
        variant="floating"
        :title="discogsData.title"
        :description="discogsData.year"
      >
        <template #content>
          <div v-if="isPending" class="flex items-center justify-center p-4">Loading...</div>
          <div v-else-if="discogsData.error" class="p-4 text-red-500">
            Error loading release details: {{ discogsData.error }}
          </div>
          <div v-else-if="!discogsData.id" class="p-4">No release details found.</div>
          <!-- Show release details -->
          <template v-else>
            <!-- <UiGradientDivider class="-my-2" /> -->
            <NuxtImg
              v-if="discogsData.images && discogsData.images.length > 0"
              :src="discogsData.images[0].uri"
              class="mx-auto mb-4 aspect-square w-48 rounded-lg object-cover"
            />
            <!-- <pre>{{ discogsData }}</pre> -->
            <div class="px-4">
              <p class="text-sm">Tracklist - {{ discogsData.tracklist.length }} tracks</p>
              <UiScrollArea class="h-[45vh] w-full">
                <UiTable>
                  <UiTableBody>
                    <UiTableRow v-for="(song, i) in discogsData.tracklist" :key="song.id">
                      <UiTableCell class="w-full max-w-[300px] truncate px-0 py-2 text-xs">
                        <NuxtLink
                          :to="`https://www.youtube.com/results?search_query=${discogsData.artists[0].name} + ${discogsData.title} + ${song.title}`"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {{ i + 1 }}. {{ song.title }}
                        </NuxtLink>
                      </UiTableCell>
                    </UiTableRow>
                  </UiTableBody>
                </UiTable>
              </UiScrollArea>
            </div>
          </template>
        </template>
        <template #footer>
          <UiSheetFooter class="grid grid-cols-2 gap-2 pt-0">
            <NuxtLink :to="discogsData.uri" target="_blank" rel="noopener noreferrer">
              <UiButton class="w-full">View album</UiButton>
            </NuxtLink>
            <UiSheetClose as-child>
              <UiButton variant="outline">Cancel</UiButton>
            </UiSheetClose>
          </UiSheetFooter>
        </template>
      </UiSheetContent>
    </UiSheet>
  </div>
</template>
