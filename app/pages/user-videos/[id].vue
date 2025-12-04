<script setup>
  import { useQuery, useQueryClient } from "@tanstack/vue-query";
  import AddVideo from "~/components/Add/Video.vue";

  definePageMeta({ ssr: false, layout: "admin" });

  const supabase = useSupabaseClient();
  const route = useRoute();
  const selectedTags = ref([]);

  const props = {
    icon: "lucide:video",
    title: "No videos",
    description: "This user hasn't added any videos yet.",
  };

  const { data: user } = useQuery({
    queryKey: ["user", route.params.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", route.params.id)
        .single();
      return data;
    },
    enabled: !!route.params.id,
  });

  const { data: userVideos, isLoading } = useQuery({
    queryKey: ["userVideos", route.params.id],
    queryFn: async () => {
      const res = await $fetch("/api/videos/getUserVideos", {
        query: { q: route.params.id || "" },
      });
      return res;
    },
    enabled: !!route.params.id,
  });

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

  const hasVideos = computed(() => Array.isArray(userVideos.value) && userVideos.value.length > 0);
</script>

<template>
  <div>
    <!-- <UserVideosHero v-if="user" :user="user" /> -->
    <UiContainer v-if="hasVideos && !isLoading" class="max-w-full gap-4 lg:flex">
      <!-- <div class="hidden min-w-[300px] lg:block lg:w-2/12">
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
      </div> -->
      <div class="m-6 w-full">
        <UiCard class="w-full">
          <UiCardContent>
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <h2 class="text-2xl font-semibold tracking-tight">
                  {{ user?.first_name }}'s videos
                </h2>
                <p class="text-muted-foreground text-sm">
                  Latest videos uploaded by {{ user?.first_name }}
                </p>
              </div>
            </div>

            <UiSeparator class="my-4" />
            <div class="relative space-y-6">
              <div v-if="userVideos && user" class="grid gap-4 lg:grid-cols-4">
                <div
                  v-for="(video, i) in filteredVideos"
                  :key="`video${i}`"
                  class="overflow-hidden rounded-sm"
                >
                  <UserVideosCard :video="video" />
                </div>
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </div>
    </UiContainer>

    <UiContainer v-else-if="!hasVideos && !isLoading" class="relative my-6 max-w-full gap-4">
      <UiCard>
        <UiCardContent>
          <div
            class="absolute inset-0 bg-[radial-gradient(--alpha(var(--color-border)/90%)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,#000_50%,transparent_100%)] [background-size:20px_20px]"
          />
          <div
            class="relative z-10 flex flex-col items-center justify-center py-16 text-center lg:py-24"
          >
            <slot name="icon">
              <UiFancyIcon v-if="props.icon" :icon="props.icon" />
            </slot>
            <slot name="title">
              <p
                class="mt-6 mb-2 text-xl font-bold tracking-tight text-balance"
                v-html="props.title"
              />
            </slot>
            <slot name="description">
              <p class="text-muted-foreground" v-html="props.description" />
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
    </UiContainer>

    <Loader v-else-if="isLoading" />
  </div>
</template>

<style scoped>
  [data-media-player][data-layout="video"],
  :where(.vds-poster) {
    background: none;
  }
</style>
