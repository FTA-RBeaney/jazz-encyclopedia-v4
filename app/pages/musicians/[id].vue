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

  const isEditing = ref(false);
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

  const handleUpdate = async () => {
    if (!data.value) return;

    let contentObj = data.value.content;
    console.log("Original content:", contentObj);

    if (typeof contentObj === "string") {
      try {
        contentObj = JSON.parse(contentObj);
        console.log("Parsed content:", contentObj);
      } catch {
        // if parsing fails, fall back to null to avoid invalid JSON
        console.log("Parsing content failed, setting to null");
        contentObj = null;
      }
    }

    const payload = {
      content: contentObj, // jsonb-compatible object
    };
    console.log("Updating musician with description:", contentObj);

    const { error } = await client.from("musicians").update(payload).eq("id", route.params.id);

    if (error) {
      console.error("Update error", error);
      notificationStore.notify("Error adding musician!", "destructive");
    } else {
      notificationStore.notify("Musician updated successfully", "success");

      isEditing.value = false;
      refresh();
      // Optionally, show a success notification
    }
  };
</script>

<template>
  <UiContainer v-if="!data" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else-if="data" class="h-full max-w-full">
    <UiBreadcrumbs :items="breadcrumbs" class="mx-6 my-6" />

    <div class="m-6">
      <UiCard>
        <UiCardContent>
          <div class="mb-2 flex justify-between">
            <h1 class="mb-2 text-3xl font-bold">{{ data.name }}</h1>
            <UiButton v-if="!isEditing" @click="isEditing = true">Edit</UiButton>
            <div v-else class="flex gap-2">
              <UiButton color="primary" @click="handleUpdate">Save</UiButton>
              <UiButton variant="secondary" @click="isEditing = false">Cancel</UiButton>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-6">
            <div class="col-span-3">
              <img :src="data?.featured_image" class="aspect-[3/4] rounded object-cover" />
            </div>

            <div class="col-span-9">
              <p class="text-muted-foreground mb-4">
                {{ data.birth_date }} - {{ data.death_date || "Present" }}
              </p>
              <UiTiptap
                v-if="isEditing"
                v-model="data.content"
                :modelType="'json'"
                placeholder="Add notes..."
                hideToolbar
                class="!min-h-48"
              />
              <client-only v-else>
                <div class="tiptap" v-html="contentHtml" />
              </client-only>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>
  </UiContainer>
</template>
