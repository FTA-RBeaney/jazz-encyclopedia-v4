<script setup lang="ts">
  import { useQueryClient } from "@tanstack/vue-query";
  import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
  import { ref } from "vue";

  import { useNotificationStore } from "../../stores/notification.store";

  const supabase = useSupabaseClient();
  const { profile } = useUserStore();
  const user = computed(() => profile);

  const props = defineProps({
    buttonText: {
      type: String,
      default: "Video",
    },
  });

  // Reuse `form` section
  const [UseTemplate, GridForm] = createReusableTemplate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const open = ref();
  const isOpen = ref(false);
  const alertMessage = ref("");
  const id = useId();

  const queryClient = useQueryClient();
  const notificationStore = useNotificationStore();

  const url = ref("");
  const start = ref("");
  const end = ref("");
  const tags = ref([]);
  const notes = ref("");
  const ytPreview = ref<null | {
    youtubeId: string | null;
    title: string;
    album: string;
    artist: string;
    description: string;
    publishedAt: string | null;
    channelTitle: string;
    duration: string | undefined;
    durationSeconds: number;
    thumbnails: any;
    tags: string[];
  }>(null);
  const ytLoading = ref(false);
  const ytError = ref<string | null>(null);

  const ytTitle = ref("");
  const ytAlbum = ref("");
  const ytArtist = ref("");
  const startSeconds = ref();
  const endSeconds = ref();

  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const fetchYoutubeIngest = async () => {
    ytError.value = null;
    if (!url.value) return;
    // Only attempt if URL looks like YouTube
    if (!youtubeRegex.test(url.value) && !/^[A-Za-z0-9_-]{11}$/.test(url.value)) return;
    try {
      ytLoading.value = true;
      const data = await $fetch("/api/youtube/ingest", {
        method: "GET",
        query: { q: url.value },
      });
      ytPreview.value = data || null;
      ytTitle.value = data?.title || "";
      ytAlbum.value = data?.tags[3] || "";
      ytArtist.value = data?.tags[0] || "";
    } catch (e) {
      if (
        e &&
        typeof e === "object" &&
        "data" in e &&
        e.data &&
        typeof e.data === "object" &&
        "statusMessage" in e.data
      ) {
        ytError.value = e.data.statusMessage;
      } else if (e && typeof e === "object" && "message" in e) {
        ytError.value = e.message;
      } else {
        ytError.value = "Failed to fetch YouTube details";
      }
      ytPreview.value = null;
    } finally {
      ytLoading.value = false;
    }
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const onSubmit = async () => {
    //convert start and end to seconds
    if (start.value) {
      startSeconds.value = start.value.split(":").reduce((acc, val) => acc * 60 + +val);
    }
    if (end.value) {
      endSeconds.value = end.value.split(":").reduce((acc, val) => acc * 60 + +val);
    }
    try {
      const { data } = await supabase
        .from("songs")
        .upsert(
          {
            unique_key_string: ytTitle.value + ytAlbum.value + ytArtist.value,
            created_by: user.value.id,
            tags: tags.value,
            title: ytTitle.value,
            duration_seconds: ytPreview.value?.durationSeconds,
            thumbnails: ytPreview.value?.thumbnails,
            album: ytAlbum.value,
            artist: ytArtist.value,
            youtube_id: ytPreview.value?.youtubeId,
          },
          { onConflict: "id" }
        )
        .select();
      if (data === null) {
        notificationStore.notify("This song already exists", "destructive");
        isOpen.value = false;
        await delay(1000);
        alertMessage.value = "";
        url.value = "";
      } else {
        notificationStore.notify("Song successfully added!", "success");
        isOpen.value = false;
        await delay(1000);
        alertMessage.value = "";
        url.value = "";
        start.value = "";
        end.value = "";
        tags.value = [];
        notes.value = "";
        queryClient.invalidateQueries({ queryKey: ["latest-songs"] });
      }
    } catch (err) {
      console.log("EXISTS", err);
      notificationStore.notify("Error adding song", "destructive");
    }
  };

  watch(
    () => isOpen.value,
    (newVal) => {
      if (!newVal) {
        // Reset form
        url.value = "";
        start.value = "";
        end.value = "";
        tags.value = [];
        notes.value = "";
        ytTitle.value = "";
        ytAlbum.value = "";
        ytArtist.value = "";
        ytPreview.value = null;
        ytError.value = null;
      }
    }
  );
</script>

<template>
  <div>
    <UiDialog v-if="isDesktop" v-model:open="isOpen">
      <UiDialogTrigger as-child>
        <UiButton variant="outline" class="w-full">
          <Icon name="lucide:plus" class="mr-0 h-4 w-4" />{{ buttonText }}
        </UiButton>
      </UiDialogTrigger>
      <UiDialogContent
        class="flex flex-col gap-0 p-0 sm:max-h-[min(80vh,80vh)] sm:max-w-lg [&>button:last-child]:hidden"
      >
        <UiDialogHeader>
          <UiDialogTitle class="px-6 pt-6 text-base"> {{ buttonText }}</UiDialogTitle>
        </UiDialogHeader>

        <form @submit.prevent="onSubmit">
          <div class="space-y-4 p-6">
            <div v-if="!ytPreview" class="flex flex-col space-y-1.5">
              <UiLabel for="url">Video URL</UiLabel>
              <UiInput
                id="url"
                v-model="url"
                type="text"
                placeholder="https://www.youtube.com/watch?v=w-1YJyi0wag"
                required
                @blur="fetchYoutubeIngest"
              />
              <div class="text-muted-foreground mt-2 text-xs">
                Paste a YouTube URL and tab out to fetch details.
              </div>
            </div>
            <div v-if="ytLoading" class="rounded-md bg-gray-50 p-3 text-sm">
              Fetching YouTube details…
            </div>
            <div v-else-if="ytError" class="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {{ ytError }}
            </div>
            <div v-else-if="ytPreview" class="flex gap-3 rounded-md bg-gray-50 p-3">
              <img
                :src="ytPreview.thumbnails?.high?.url || ytPreview.thumbnails?.default?.url"
                class="h-16 w-28 rounded object-cover"
              />
              <div class="min-w-0">
                <div class="truncate text-sm font-medium">{{ ytPreview.title }}</div>
                <div class="text-muted-foreground text-xs">{{ ytPreview.channelTitle }}</div>
                <div v-if="ytPreview.durationSeconds" class="text-muted-foreground text-xs">
                  Duration:
                  {{
                    Math.floor(ytPreview.durationSeconds / 60)
                      .toString()
                      .padStart(2, "0")
                  }}:{{
                    Math.floor(ytPreview.durationSeconds % 60)
                      .toString()
                      .padStart(2, "0")
                  }}
                </div>
              </div>
            </div>
            <div class="grid gap-4">
              <div class="flex flex-col space-y-1.5">
                <UiLabel for="ytTitle">Title</UiLabel>
                <UiInput id="ytTitle" v-model="ytTitle" type="text" />
              </div>
            </div>

            <div class="grid gap-4">
              <div class="flex flex-col space-y-1.5">
                <UiLabel for="ytAlbum">Album</UiLabel>
                <UiInput id="ytAlbum" v-model="ytAlbum" type="text" />
              </div>
            </div>

            <div class="grid gap-4">
              <div class="flex flex-col space-y-1.5">
                <UiLabel for="ytArtist">Artist</UiLabel>
                <UiInput id="ytArtist" v-model="ytArtist" type="text" />
              </div>
            </div>

            <div class="flex flex-col space-y-1.5">
              <UiLabel for="tags">Tags</UiLabel>

              <UiTagsInput
                v-model="tags"
                class="focus-within:border-ring focus-within:ring-ring/50 h-auto p-1 shadow-xs outline-none focus-within:ring-[3px]"
              >
                <UiTagsInputItem v-for="tag in tags" :key="tag" :value="tag" />

                <UiTagsInputInput
                  :id="id + 'some-other'"
                  placeholder="Add tags..."
                  class="h-7 min-w-20 px-2 dark:bg-transparent"
                  type="text"
                />
              </UiTagsInput>
            </div>
            <!-- <div class="flex flex-col space-y-1.5">
              <UiLabel for="notes">Notes</UiLabel>
              <UiTiptap
                v-model="notes"
                placeholder="Add notes..."
                hide-toolbar
                class="h-48 min-h-48!"
              />
            </div> -->
          </div>

          <UiDialogFooter class="border-border border-t px-6 py-4">
            <UiDialogClose as-child>
              <UiButton variant="outline">Cancel</UiButton>
            </UiDialogClose>
            <UiButton type="submit">Add Song</UiButton>
          </UiDialogFooter>
        </form>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
