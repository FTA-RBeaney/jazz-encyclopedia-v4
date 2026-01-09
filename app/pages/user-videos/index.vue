<script setup>
  import { useQuery, useQueryClient } from "@tanstack/vue-query";

  definePageMeta({ ssr: false, layout: "admin" });

  const { profile } = useUserStore();
  const user = computed(() => profile);

  const props = {
    icon: "lucide:search",
    title: "No videos found",
    description: "Try adding a new video.",
  };

  const { data: userVideos, isLoading } = useQuery({
    queryKey: ["userVideos", user?.value?.id],
    queryFn: async () => {
      const res = await $fetch("/api/youtube/getUserVideos", {
        query: { q: user?.value?.sub || "" },
      });
      return res;
    },
    enabled: !!user?.value?.id,
  });

  const chosenVideo = ref();
  const chosenVideoDetails = ref();
  const selectedTags = ref([]);

  const allTags = computed(() => {
    if (!userVideos.value) return [];
    const tags = new Set();
    userVideos.value.forEach((video) => {
      if (video.tags) {
        video.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  });

  const filteredVideos = computed(() => {
    if (!selectedTags.value.length || !userVideos.value) return userVideos.value;
    return userVideos.value.filter((video) => {
      if (!video.tags) return false;
      return video.tags.some((tag) => selectedTags.value.includes(tag));
    });
  });

  const toggleTag = (tag, checked) => {
    if (checked) {
      selectedTags.value.push(tag);
    } else {
      selectedTags.value = selectedTags.value.filter((t) => t !== tag);
    }
  };

  const changeVideo = (id, start, end) => {
    chosenVideo.value = {
      url: id,
      start: start,
      end: end,
    };
  };
</script>

<template>
  <UiContainer class="m-6 max-w-full gap-4 lg:flex">
    <!-- Loading state -->
    <template v-if="isLoading">
      <Loader />
    </template>
    <template v-else-if="userVideos && userVideos.length">
      <div class="hidden min-w-[300px] lg:block lg:w-2/12">
        <UiCard class="sticky top-10">
          <UiCardHeader>
            <UiCardTitle>Filter</UiCardTitle>
            <UiCardDescription>Filter videos below</UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <div class="space-y-6">
              <div class="space-y-2">
                <h3 class="text-sm font-medium">Tags</h3>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center space-x-2" v-for="tag in allTags" :key="tag">
                    <UiCheckbox
                      :id="tag"
                      :checked="selectedTags.includes(tag)"
                      :name="tag"
                      @update:checked="toggleTag(tag, $event)"
                    />
                    <label
                      :for="tag"
                      class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >{{ tag }}</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </UiCardContent>
          <UiCardFooter
            ><UiButton @click="selectedTags = []"> Reset filters </UiButton></UiCardFooter
          >
        </UiCard>
      </div>
      <div class="w-full lg:w-10/12">
        <div v-if="chosenVideo" class="mb-4">
          <VideoPlayer
            :video="`https://www.youtube.com/embed/${chosenVideo.url}?rel=0&showinfo=0&controls=0`"
            :start="chosenVideo.start"
            :end="chosenVideo.end"
          />
        </div>
        <UiCard class="w-full">
          <UiCardContent class="py-6">
            <div class="flex items-center justify-between">
              <div class="mb-6 space-y-1">
                <h2 class="text-2xl font-semibold tracking-tight">Your videos</h2>
                <p class="text-muted-foreground text-sm">Latest videos uploaded by you</p>
              </div>
              <div class="mr-4 ml-auto">
                <AddVideo />
              </div>
            </div>

            <UiSeparator class="my-4" />
            <!-- <VideosUserVideosH /> -->

            <div class="relative space-y-6">
              <div v-if="userVideos" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                <div
                  v-for="(video, i) in filteredVideos"
                  :key="video.id"
                  class="overflow-hidden rounded-sm"
                >
                  <UserVideosCard :video="video" />
                </div>
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </div>
    </template>

    <!-- Empty state when no videos -->
    <template v-else>
      <UiCard class="sticky top-10 w-full">
        <UiCardContent>
          <div
            class="absolute inset-0 bg-[radial-gradient(--alpha(var(--color-border)/90%)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,#000_50%,transparent_100%)] [background-size:20px_20px]"
          />
          <div
            class="relative z-10 flex flex-col items-center justify-center py-16 text-center lg:py-24"
          >
            <slot name="icon">
              <UiFancyIcon v-if="props.icon" icon="lucide:search" />
            </slot>
            <slot name="title">
              <p
                class="mt-6 mb-2 text-xl font-bold tracking-tight text-balance"
                v-dompurify-html="props.title"
              />
            </slot>
            <slot name="description">
              <p class="text-muted-foreground" v-dompurify-html="props.description" />
            </slot>
            <slot>
              <div
                class="mt-5 grid w-full grid-cols-1 justify-center gap-3 sm:flex sm:items-center"
              >
                <AddVideo />
              </div>
            </slot>
          </div>
        </UiCardContent>
      </UiCard>
    </template>
  </UiContainer>
</template>

<style scoped>
  [data-media-player][data-layout="video"],
  :where(.vds-poster) {
    background: none;
  }
</style>
