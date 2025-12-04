<script setup>
  import { useQuery, useQueryClient } from "@tanstack/vue-query";
  import { computed, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";

  definePageMeta({
    layout: "admin",
  });

  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();
  const notificationStore = useNotificationStore();
  const queryClient = useQueryClient();

  const route = useRoute();
  const router = useRouter();
  const id = String(route.params.id);

  const {
    isPending,
    isError,
    data: video,
    error: videoError,
  } = useQuery({
    queryKey: [id],
    queryFn: async () => await supabase.from("videos").select("*").eq("id", id).single(),
  });

  const open = ref(false);
  const url = ref(video.value?.data?.url);
  const start = ref(video.value?.data?.start);
  const end = ref(video.value?.data?.end);
  const tags = ref(video.value?.data?.tags);
  const notes = ref(video.value?.data?.notes);
  const views = ref(video.value?.data?.views);
  const ytTitle = ref(video.value?.data?.title);

  onMounted(async () => {
    // Sync form fields once video data is available
    watchEffect(() => {
      const v = video.value?.data;
      if (!v) return;
      url.value = v.url;
      start.value = v.start;
      end.value = v.end;
      tags.value = Array.isArray(v.tags) ? v.tags : [];
      notes.value = v.notes ?? null;
      views.value = v.views;
    });

    const currentViews = views.value;
    const newViews = currentViews + 1;

    const { data, error } = await supabase
      .from("videos")
      .update({ views: newViews })
      .eq("id", id)
      .select();
  });

  const videoTitle = computed(() => video.value?.data?.title);

  const videoUrl = computed(
    () => `https://www.youtube.com/embed/${video.value?.data?.url}?rel=0&modestbranding=1`
  );

  const videoDuration = computed(() => video.value?.data?.duration);
  const videoViews = computed(() => video.value?.data?.views);
  const videoTags = computed(() => video.value?.data?.tags);
  const videoNotes = computed(() => video.value?.data?.notes);
  const videoStart = computed(() => video.value?.data?.start);
  const videoEnd = computed(() => video.value?.data?.end);

  const crumbs = computed(() => [
    {
      disabled: true,
      icon: "heroicons:home",
    },
    {
      label: prevPage.value.label,
      link: prevPage.value.link,
      disabled: false,
    },
    {
      label: videoTitle ?? "",
      link: `/user-video/${videoTitle ?? ""}`,
      disabled: true,
    },
  ]);

  const prevPage = ref({
    label: "New Videos",
    link: "/new-videos",
  });

  onMounted(() => {
    // Try to get previous route from history state (works for in-app navigation)
    const state = window.history.state;
    if (state && state.back) {
      // You may want to map known routes to labels here
      if (state.back.includes("/popular-videos")) {
        prevPage.value = { label: "Popular Videos", link: "/popular-videos" };
      } else if (state.back.includes("/new-videos")) {
        prevPage.value = { label: "New Videos", link: "/new-videos" };
      } else {
        // fallback to referrer or default
        prevPage.value = { label: "User's videos", link: state.back };
      }
    } else if (document.referrer) {
      prevPage.value = { label: "Previous Page", link: document.referrer };
    }
  });
</script>

<template>
  <UiContainer class="my-6">
    <div class="mx-auto my-6 flex justify-between gap-8">
      <UiBreadcrumbs :items="crumbs" />
      <UserVideosEditModal :video="video" />
    </div>
    <div class="flex gap-4">
      <div class="w-10/12">
        <div class="mb-4">
          <VideoPlayer :video="videoUrl" :start="videoStart" :end="videoEnd" autoplay />
        </div>

        <div>
          <div>
            <p class="my-4 text-xl font-semibold lg:text-2xl">
              {{ videoTitle }}
            </p>

            <UiCard>
              <UiCardContent>
                <h2 class="font-bold">Notes</h2>
                <div v-html="video?.data?.notes" />
                <h2 class="mt-2 font-bold">Tags</h2>
                <NuxtLink v-for="(tag, i) in videoTags" :key="`tag${i}`" :to="`/videos/${tag}`">
                  <UiBadge class="mt-2 mr-1 rounded-sm">
                    {{ tag }}
                  </UiBadge>
                </NuxtLink>
              </UiCardContent>
            </UiCard>
          </div>
        </div>
      </div>
      <div class="w-2/12 min-w-[300px]">
        <div>
          <CommentsList />
        </div>
      </div>
    </div>
  </UiContainer>
</template>

<style scoped>
  [data-media-player][data-layout="video"],
  :where(.vds-poster) {
    background: none;
  }
</style>
