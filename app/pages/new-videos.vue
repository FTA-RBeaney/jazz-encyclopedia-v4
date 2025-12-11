<script setup>
  import AddVideo from "~/components/Add/Video.vue";
  import { useLatestVideos } from "~/composables/useLatestVideos";

  // Disable SSR for this page to avoid hydration mismatch with client-only data fetching
  definePageMeta({ ssr: false, layout: "admin" });

  // const accountStore = useAuthStore();
  // const { user } = storeToRefs(accountStore);

  const { profile } = useUserStore();
  const user = computed(() => profile);

  const props = {
    icon: "lucide:search",
    title: "No videos found",
    description: "Try adding a new video.",
  };

  // const { data: latestVideo, isLoading, error } = useLatestVideo();
  const { data: latestVideos, isLoading } = useLatestVideos();

  // Explicit helpers for rendering states
  const isAuthed = computed(() => !!user.value?.id);

  const tagsVisible = ref(true);
  const userVisible = ref(true);
  const numberOfColumns = ref(5);

  const columnChoices = [3, 5];

  const toggleTags = () => {
    tagsVisible.value = !tagsVisible.value;
  };

  const toggleUser = () => {
    userVisible.value = !userVisible.value;
  };

  const toggleColumns = (event) => {
    numberOfColumns.value = event.target.innerText;
  };
</script>

<template>
  <UiContainer v-if="isLoading" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else-if="latestVideos" class="h-full max-w-full">
    <!-- <FeaturedVideo v-if="latestVideo.youtube" :video="latestVideo" /> -->
    <div class="m-6">
      <UiCard class="resize">
        <UiCardContent>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">Latest videos</h2>
              <p class="text-muted-foreground text-sm">Latest videos uploaded by users</p>
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground text-sm">Toggle visibility:</span>
              </div>
              <UiBadge variant="primary" @click="toggleUser">
                <Icon v-if="userVisible" name="lucide:eye" />
                <Icon v-else name="lucide:eye-off" />
                Users</UiBadge
              >
              <UiBadge variant="primary" @click="toggleTags">
                <Icon v-if="tagsVisible" name="lucide:eye" />
                <Icon v-else name="lucide:eye-off" />
                Tags</UiBadge
              >
              <div class="flex items-center justify-center gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-muted-foreground text-sm">Columns:</span>
                </div>
                <UiButtonGroup>
                  <UiButtonGroup>
                    <UiButton
                      v-for="item in columnChoices"
                      :key="item"
                      :class="numberOfColumns == item ? 'bg-gray-100' : 'bg-white'"
                      variant="outline"
                      size="sm"
                      @click="toggleColumns"
                    >
                      {{ item }}
                    </UiButton>
                  </UiButtonGroup>
                </UiButtonGroup>
              </div>
            </div>
          </div>
          <UiSeparator class="my-4" />
          <div class="relative space-y-6">
            <div
              class="grid grid-cols-2 gap-4 lg:grid-cols-3"
              :class="`xl:grid-cols-${numberOfColumns}`"
            >
              <div
                v-for="(video, i) in latestVideos"
                :key="video.supabase_id || video.id || i"
                class="overflow-hidden rounded-sm"
              >
                <UserVideosCard
                  :video="video"
                  :tags-visible="tagsVisible"
                  :user-visible="userVisible"
                />
              </div>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>
  </UiContainer>

  <UiContainer v-else>
    <UiCard class="relative m-6">
      <UiCardContent>
        <div
          class="absolute inset-0 h-full bg-[radial-gradient(--alpha(var(--color-border)/90%)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,#000_50%,transparent_100%)] [background-size:20px_20px]"
        />
        <div
          class="relative z-10 flex flex-col items-center justify-center py-16 text-center lg:py-24"
        >
          <div>
            <UiFancyIcon v-if="props.icon" icon="lucide:search" />
          </div>
          <div>
            <p
              class="mt-6 mb-2 text-xl font-bold tracking-tight text-balance"
              v-dompurify-html="props.title"
            />
          </div>
          <div>
            <p class="text-muted-foreground" v-if="isAuthed" v-dompurify-html="props.description" />
            <p class="text-muted-foreground" v-else>Sign in to view your videos.</p>
          </div>
          <div>
            <div class="mt-5 grid w-full grid-cols-1 justify-center gap-3 sm:flex sm:items-center">
              <AddVideo v-if="isAuthed" />
              <UiButton to="/signin" v-else>Sign in</UiButton>
            </div>
          </div>
        </div>
      </UiCardContent>
    </UiCard>
  </UiContainer>
</template>
