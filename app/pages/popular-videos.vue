<script setup lang="ts">
  import { usePopularVideos } from "~/composables/usePopularVideos";

  // Disable SSR for this page to avoid hydration mismatch with client-only data fetching
  definePageMeta({ ssr: false, layout: "admin" });

  interface UserProfile {
    id?: string;
    [key: string]: unknown;
  }

  const { profile } = useUserStore();
  const user = computed<UserProfile | null>(() => profile as UserProfile | null);

  const props = {
    icon: "lucide:search",
    title: "No videos found",
    description: "Try adding a new video.",
  };

  const { data: popularVideos, isLoading } = usePopularVideos({
    // Refresh data every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });

  // Explicit helpers for rendering states
  const isAuthed = computed(() => !!user.value?.id);
</script>

<template>
  <UiContainer class="max-w-full gap-4 lg:flex">
    <Loader v-if="isLoading" />

    <template v-else-if="popularVideos">
      <div class="m-6 w-full">
        <!-- <FeaturedVideo v-if="popularVideos" :video="popularVideos[0]" /> -->

        <UiCard class="w-full">
          <UiCardContent>
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <h2 class="text-2xl font-semibold tracking-tight">Popular videos</h2>
                <p class="text-muted-foreground text-sm">
                  Top 10 most popular videos based on views
                </p>
              </div>
            </div>
            <UiSeparator class="my-4" />
            <div class="relative space-y-6">
              <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
                <div
                  v-for="(video, i) in popularVideos"
                  :key="video.id || i"
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

    <template v-else>
      <UiContainer class="relative my-6">
        <UiCard class="sticky top-10">
          <UiCardContent>
            <div
              class="absolute inset-0 bg-[radial-gradient(--alpha(var(--color-border)/90%)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,#000_50%,transparent_100%)] [background-size:20px_20px]"
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
                <p
                  class="text-muted-foreground"
                  v-if="isAuthed"
                  v-dompurify-html="props.description"
                />
                <p class="text-muted-foreground" v-else>Sign in to view your videos.</p>
              </div>
              <div>
                <div
                  class="mt-5 grid w-full grid-cols-1 justify-center gap-3 sm:flex sm:items-center"
                >
                  <AddVideo v-if="isAuthed" />
                  <UiButton to="/signin" v-else>Sign in</UiButton>
                </div>
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </UiContainer>
    </template>
  </UiContainer>
</template>
