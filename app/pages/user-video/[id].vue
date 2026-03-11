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
    isPending: videoIsPending,
    isError: videoIsError,
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

  const youtubeIdRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const videoUrl = computed(() => {
    const raw = video.value?.data?.url;
    if (!raw) return null;
    const match = raw.match(youtubeIdRegex);
    const id = match ? match[1] : raw;
    return `https://www.youtube.com/watch?v=${id}`;
  });

  const videoDuration = computed(() => video.value?.data?.duration);
  const videoViews = computed(() => video.value?.data?.views);
  const videoTags = computed(() => video.value?.data?.tags);
  const videoNotes = computed(() => video.value?.data?.notes);
  const videoStart = computed(() => video.value?.data?.start);
  const videoEnd = computed(() => video.value?.data?.end);

  const videoPosterImage = computed(() => {
    const raw = video.value?.data?.url;
    if (!raw) return null;
    const match = raw.match(youtubeIdRegex);
    const ytId = match ? match[1] : null;
    // return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
    return ytId
      ? video?.value?.data?.thumbnails?.maxres?.url
      : video?.value?.data?.thumbnails?.standard?.url;
  });

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

  const fetchComments = async () => {
    const data = await $fetch(`/api/comments/${route.params.id}`);

    return data?.comments ?? [];
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["comments", route.params.id],
    queryFn: fetchComments,
  });
</script>

<template>
  <UiContainer class="my-6 !max-w-full">
    <div class="mx-auto my-6 flex justify-between gap-8">
      <UiBreadcrumbs :items="crumbs" />
      <UserVideosEditModal :video="video" />
    </div>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-8 gap-4">
        <div class="flex flex-col gap-4">
          <div>
            <ClientOnly>
              <VideoPlayer
                v-if="videoUrl"
                :video="videoUrl"
                :start="videoStart"
                :end="videoEnd"
                :poster-image="videoPosterImage"
              />
            </ClientOnly>
          </div>

          <div>
            <div>
              <p class="my-4 text-xl font-semibold lg:text-2xl">
                {{ videoTitle }}
              </p>

              <UiCard>
                <UiCardContent>
                  <div class="grid gap-2">
                    <div v-if="video?.data?.notes">
                      <h2 class="font-bold">Notes</h2>
                      <div v-dompurify-html="video?.data?.notes" />
                    </div>
                    <div v-if="videoTags">
                      <h2 class="font-bold">Tags</h2>
                      <NuxtLink
                        v-for="(tag, i) in videoTags"
                        :key="`tag${i}`"
                        :to="`/videos/${tag}`"
                      >
                        <UiBadge class="mt-2 mr-1 rounded-sm">
                          {{ tag }}
                        </UiBadge>
                      </NuxtLink>
                    </div>
                  </div>
                </UiCardContent>
              </UiCard>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-4 min-w-[300px]">
        <CommentsList :comments="data" />
      </div>
    </div>
  </UiContainer>
</template>

<style>
  [data-media-player][data-layout="video"],
  :where(.vds-poster) {
    background: none;
  }
  iframe.vds-youtube[data-no-controls] {
    height: 100% !important;
  }

  :where(.vds-poster) {
    height: 140% !important;
  }
</style>
