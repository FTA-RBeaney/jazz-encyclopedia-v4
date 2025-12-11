<script setup lang="ts">
  import { generateHTML } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";

  import { useNotificationStore } from "../../stores/notification.store";

  definePageMeta({
    layout: "admin",
  });

  const notificationStore = useNotificationStore();
  const client = useSupabaseClient();
  const route = useRoute();

  const pageIsBeingEdited = ref(false);
  const musicianData = ref();

  const { data, status, pending, error, refresh, clear } = await useAsyncData(
    `musician-${route.params.id}`,
    async () => {
      const { data, error } = await client
        .from("musicians")
        .select("*")
        .eq("id", route.params.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      musicianData.value = data;
      return data;
    }
  );

  const breadcrumbs = computed(() => [
    {
      label: "Musicians",
      link: "/musicians",
      disabled: false,
    },
    {
      label: data.value?.name || "Loading...",
      link: `/musicians/${route.params.id}`,
      disabled: true,
    },
  ]);

  const contentHtml = computed(() => {
    const content = data?.value?.content;
    if (!content) return "";
    let json = content as any;
    if (typeof json === "string") {
      try {
        json = JSON.parse(json);
      } catch {
        return "";
      }
    }
    try {
      return generateHTML(json, [StarterKit]);
    } catch {
      return "";
    }
  });

  const props = withDefaults(
    defineProps<{
      title?: string;
      description?: string;
      icon?: string;
    }>(),
    {
      icon: "lucide:search",
      title: "No data found",
      description: "Try editing this page and adding some content.",
    }
  );

  const handleIndividualUpdate = async () => {
    notificationStore.notify("Musician updated successfully", "success");
  };

  const links = ref<PageLink[]>([
    {
      label: "Spotify",
      icon: "logos:spotify-icon",
      to: data.value?.spotify_id
        ? `https://open.spotify.com/artist/${data.value?.spotify_id}`
        : "#",
    },
    {
      label: "Wikipedia",
      icon: "flat-color-icons:wikipedia",
      to: data.value?.wiki_data ? data.value?.wiki_data.content_urls.desktop.page : "#",
    },
  ]);
</script>

<template>
  <UiContainer v-if="!data" class="my-6 max-w-full gap-4">
    <Loader />
  </UiContainer>

  <UiContainer v-else-if="data" class="mb-6 h-full max-w-full">
    <div class="flex items-center justify-between">
      <UiBreadcrumbs :items="breadcrumbs" class="mx-6 my-6" />
      <UiButton v-if="!pageIsBeingEdited" @click="pageIsBeingEdited = true">Edit</UiButton>
    </div>

    <div class="grid gap-6">
      <UiCard class="m-0 p-0">
        <UiCardContent class="m-0 aspect-16/6 max-h-96 p-0">
          <div
            class="relative flex h-full items-center justify-start overflow-hidden rounded-xl bg-black"
          >
            <img
              :src="data.featured_image || data.wiki_data?.originalimage?.source"
              class="absolute right-0 h-full w-1/2 object-cover"
            />
            <div class="absolute left-6/12 z-20 h-full w-3/12 bg-linear-to-r from-black"></div>
            <div class="max-w-6/12 px-10">
              <div class="bg-opacity-50 font-jost relative z-10 rounded py-1 text-6xl text-white">
                {{ data.name }}
              </div>
              <p v-if="data?.birth_date" class="text-md mb-4 text-right text-white italic">
                {{ useDateFormat(data.birth_date, "Do MMM YYYY").value }}
              </p>
            </div>
          </div>
        </UiCardContent>
      </UiCard>

      <div class="grid grid-cols-12 items-start gap-6">
        <UiCard class="col-span-3">
          <UiCardContent>
            <UPageLinks title="Links" :links="links" />
          </UiCardContent>
        </UiCard>

        <UiCard class="col-span-9">
          <UiCardContent>
            <MusicianEditForm
              v-if="pageIsBeingEdited"
              :data="data"
              @update:pageIsBeingEdited="pageIsBeingEdited = $event"
            />
            <div v-else>
              <client-only>
                <div v-if="!contentHtml">
                  <UiContainer class="relative">
                    <div
                      class="absolute inset-0 bg-[radial-gradient(--alpha(var(--color-border)/90%)_1px,transparent_1px)] mask-[radial-gradient(ellipse_closest-side_at_50%_50%,#000_50%,transparent_100%)] bg-size-[20px_20px]"
                    />
                    <div
                      class="relative z-10 flex flex-col items-center justify-center py-16 text-center lg:py-24"
                    >
                      <slot name="icon">
                        <UiFancyIcon v-if="props.icon" icon="lucide:search" />
                      </slot>
                      <slot name="title">
                        <p class="mt-6 mb-2 text-xl font-bold tracking-tight text-balance">
                          {{ props.title }}
                        </p>
                      </slot>
                      <slot name="description">
                        <p class="text-muted-foreground" v-dompurify-html="props.description" />
                      </slot>
                      <slot>
                        <div
                          class="mt-5 grid w-full grid-cols-1 justify-center gap-3 sm:flex sm:items-center"
                        >
                          <UiButton v-if="!pageIsBeingEdited" @click="pageIsBeingEdited = true"
                            >Edit page</UiButton
                          >
                        </div>
                      </slot>
                    </div>
                  </UiContainer>
                </div>
                <div v-else v-dompurify-html="contentHtml" class="prose"></div>
              </client-only>
            </div>
          </UiCardContent>
        </UiCard>
      </div>

      <MusicianLinks :musicianId="data.id" />
    </div>
  </UiContainer>
</template>

<style lang="scss">
  .prose {
    p {
      margin-bottom: 1rem;
    }
    a {
      color: var(--color-primary);
    }
  }

  .font-jost {
    font-family: "Jost", sans-serif;
    font-display: optional;
    font-optical-sizing: auto;
    font-weight: 800;
    font-style: normal;
    text-transform: uppercase !important;
    letter-spacing: 1px;
  }
</style>
