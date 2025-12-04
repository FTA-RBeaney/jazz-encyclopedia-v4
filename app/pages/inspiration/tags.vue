<script setup>
  // Disable SSR for this page to avoid hydration mismatch with client-only data fetching
  definePageMeta({ ssr: false, layout: "admin" });

  const supabase = useSupabaseClient();

  const {
    data: tags,
    pending: isLoading,
    refresh: refreshTags,
  } = await useAsyncData(
    "video-tags-page",
    async () => {
      const { data, error } = await supabase.from("video_tags_with_counts").select("*");
      if (error) throw error;
      return data ?? [];
    },
    {
      server: false,
      default: () => [],
    }
  );

  onMounted(async () => {
    try {
      // Ensure we always revalidate when navigating back to this view
      await refreshTags();
    } catch (error) {
      console.error("Failed to refresh video tags", error);
    }
  });
</script>

<template>
  <UiContainer class="my-6 max-w-full gap-4 lg:flex" v-if="isLoading">
    <Loader />
  </UiContainer>

  <UiContainer class="mb-6 min-h-[80vh] max-w-[80vw] gap-4 bg-white lg:flex" v-else-if="tags">
    <div class="w-full">
      <UiCard class="w-full border-none">
        <UiCardContent class="py-10">
          <div class="flex items-center justify-between">
            <div class="mb-6 space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">Browse videos by tag</h2>
              <p class="text-muted-foreground text-sm">Browse all tags</p>
            </div>
          </div>

          <UiSeparator class="my-4" />
          <div class="relative space-y-6">
            <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
              <div v-for="tag in tags" :key="tag.tag">
                <TagCard :tag="tag" />
              </div>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>
  </UiContainer>
</template>
