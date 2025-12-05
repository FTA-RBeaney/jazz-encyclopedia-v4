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
      const data = await $fetch("/api/youtube/ingest", { query: { q: url.value } });
      ytPreview.value = data || null;
      // If no end provided, prefill end with full duration (mm:ss) for convenience
      // if (data?.durationSeconds && !end.value) {
      //   const total = Number(data.durationSeconds);
      //   const mm = String(Math.floor(total / 60)).padStart(2, "0");
      //   const ss = String(Math.floor(total % 60)).padStart(2, "0");
      //   end.value = `${mm}:${ss}`;
      // }
      ytTitle.value = data?.title || "";
    } catch (e: any) {
      ytError.value = e?.message || "Failed to fetch YouTube details";
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

    const toSecondsOrNull = (value, originallyNull) => {
      if (originallyNull) {
        // Treat blank and 00:00(/00) as null to preserve absence
        if (!value || value === "00:00" || value === "00:00:00") return null;
        const s = parseTimeToSeconds(value);
        return s === 0 ? null : s;
      }
      // If it existed before, honor explicit 00:00 as 0
      return parseTimeToSeconds(value);
    };

    try {
      const { data, error } = await supabase
        .from("videos")
        .upsert(
          {
            created_by: user.value.id,
            url: url.value,
            user_id: user.value.id,
            start: startSeconds.value,
            end: endSeconds.value,
            tags: tags.value,
            notes: notes.value,
            // If your schema has columns to store these, you may add them later.
            // youtube_id: ytPreview.value?.youtubeId,
            title: ytTitle.value,
            // youtube_duration_seconds: ytPreview.value?.durationSeconds,
            thumbnails: ytPreview.value?.thumbnails,
          },
          { onConflict: "id" }
        )
        .select();

      if (data === null) {
        notificationStore.notify("This video already exists", "destructive");
        isOpen.value = false;
        await delay(1000);
        alertMessage.value = "";
        url.value = "";
      } else {
        notificationStore.notify("Video successfully added!", "success");
        isOpen.value = false;
        await delay(1000);
        alertMessage.value = "";
        url.value = "";
        start.value = "";
        end.value = "";
        tags.value = [];
        notes.value = "";
        queryClient.invalidateQueries({ queryKey: ["allVideos"] });
        queryClient.invalidateQueries({ queryKey: ["userVideos", user.value.id] });
      }
    } catch (error) {
      console.log("EXISTS", error);
      notificationStore.notify("Error adding video", "destructive");
    }
  };
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
            <div class="flex flex-col space-y-1.5">
              <UiLabel for="url">Video URL</UiLabel>
              <UiInput
                id="url"
                type="text"
                placeholder="https://www.youtube.com/watch?v=w-1YJyi0wag"
                v-model="url"
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
                <div class="text-muted-foreground text-xs" v-if="ytPreview.durationSeconds">
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
                <UiInput id="ytTitle" type="text" v-model="ytTitle" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col space-y-1.5">
                <UiLabel for="start">Start time</UiLabel>
                <UiInput id="start" type="time" placeholder="00:00" v-model="start" />
              </div>
              <div class="flex flex-col space-y-1.5">
                <UiLabel for="end">End time</UiLabel>
                <UiInput id="end" type="time" placeholder="00:00" v-model="end" />
              </div>
            </div>

            <div class="flex flex-col space-y-1.5">
              <UiLabel for="tags">Tags</UiLabel>
              <!-- <UiTagsInput v-model="tags">
                <UiTagsInputItem v-for="tag in tags" :key="tag" :value="tag" />
                <UiTagsInputField placeholder="Add tags..." />
                <UiTagsInputClear />
              </UiTagsInput> -->

              <UiTagsInput
                v-model="tags"
                class="focus-within:border-ring focus-within:ring-ring/50 h-auto p-1 shadow-xs outline-none focus-within:ring-[3px]"
              >
                <UiTagsInputItem v-for="tag in tags" :key="tag" :value="tag" />

                <UiTagsInputInput
                  :id="id + 'some-other'"
                  placeholder="Add tags..."
                  class="h-7 min-w-[80px] px-2 dark:bg-transparent"
                  type="text"
                />
              </UiTagsInput>
            </div>
            <div class="flex flex-col space-y-1.5">
              <UiLabel for="notes">Notes</UiLabel>
              <UiTiptap
                v-model="notes"
                placeholder="Add notes..."
                hideToolbar
                class="h-48 !min-h-48"
              />
            </div>
          </div>

          <UiDialogFooter class="border-border border-t px-6 py-4">
            <UiDialogClose as-child>
              <UiButton variant="outline">Cancel</UiButton>
            </UiDialogClose>
            <UiButton type="submit">Add Video</UiButton>
          </UiDialogFooter>
        </form>
      </UiDialogContent>
    </UiDialog>

    <!-- <UiDrawer v-else v-model="open" v-model:open="isOpen">
      <DrawerTrigger as-child>
        <Button variant="outline">
          <Icon name="lucide:plus" class="mr-2 h-4 w-4" />{{ buttonText }}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader class="text-left">
          <DrawerTitle>{{ buttonText }}</DrawerTitle>
          <DrawerDescription> Add the URL below </DrawerDescription>
        </DrawerHeader>
        <GridForm />
        <DrawerFooter class="pt-2">
          <DrawerClose as-child>
            <Button variant="outline"> Cancel </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </UiDrawer> -->
  </div>

  <!-- <div>
    <UseTemplate>
      <form @submit.prevent="onSubmit" class="grid items-start gap-4 px-4">
        <div class="grid gap-2">
          <Field v-slot="{ componentField }" name="url">
            <UiFormItem>
              <UiFormLabel>Youtube URL</UiFormLabel>
              <UiFormControl>
                <Input
                  id="url"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=w-1YJyi0wag"
                  v-bind="componentField"
                />
              </UiFormControl>
            </UiFormItem>
          </Field>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <Field v-slot="{ componentField }" name="start">
                <UiFormItem>
                  <UiFormLabel>Start time</UiFormLabel>
                  <UiFormControl>
                    <Input id="start" type="text" placeholder="0" v-bind="componentField" />
                  </UiFormControl>
                </UiFormItem>
              </Field>
            </div>
            <div>
              <Field v-slot="{ componentField }" name="end">
                <UiFormItem>
                  <UiFormLabel>End time</UiFormLabel>
                  <UiFormControl>
                    <Input id="end" type="text" placeholder="10" v-bind="componentField" />
                  </UiFormControl>
                </UiFormItem>
              </Field>
            </div>
          </div>
          <div>
            <Field v-slot="{ componentField }" name="tags">
              <UiFormItem>
                <UiFormLabel>Tags</UiFormLabel>
                <UiFormControl>
                  <TagsInput :model-value="componentField.modelValue">
                    <TagsInputItem
                      v-for="item in componentField.modelValue"
                      :key="item"
                      :value="item"
                    >
                      <TagsInputItemText />
                      <TagsInputItemDelete />
                    </TagsInputItem>

                    <TagsInputInput placeholder="Tags..." />
                  </TagsInput>
                </UiFormControl>
                <UiFormDescription> Select your tags. </UiFormDescription>
                <UiFormMessage />
              </UiFormItem>
            </Field>
          </div>
          <Button type="submit" class="mt-6">
            <CirclePlus class="mr-2 h-4 w-4" /> Add a video
          </Button>
        </div>
      </form>
    </UseTemplate>

    <Dialog v-if="isDesktop" v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button variant="outline" @click="open = true"
          ><CirclePlus class="mr-2 h-4 w-4" /> Add a video
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a video</DialogTitle>
          <DialogDescription> Add the URL below </DialogDescription>
        </DialogHeader>
        <GridForm />
      </DialogContent>
    </Dialog>

    <Drawer v-else v-model="open" v-model:open="isOpen">
      <DrawerTrigger as-child>
        <Button variant="outline" @click="open = true"
          ><CirclePlus class="mr-2 h-4 w-4" /> Add a video
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader class="text-left">
          <DrawerTitle>Add a video</DrawerTitle>
          <DrawerDescription> Add the URL below </DrawerDescription>
        </DrawerHeader>
        <GridForm />
        <DrawerFooter class="pt-2">
          <DrawerClose as-child>
            <Button variant="outline"> Cancel </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div> -->
</template>
