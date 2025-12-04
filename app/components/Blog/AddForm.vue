<script setup lang="ts">
  import { useQueryClient } from "@tanstack/vue-query";

  import { useNotificationStore } from "../../stores/notification.store";

  const queryClient = useQueryClient();

  const notificationStore = useNotificationStore();

  const supabase = useSupabaseClient();
  const newPost = ref({
    title: "How to use TipTap with Supabase",
    slug: "tiptap-supabase",
    summary: "Quick guide",
    content: { ops: [{ insert: "Hello TipTap" }] }, // example jsonb content
    metadata: { tags: ["editor", "tiptap"] },
    published: false,
  });

  async function submitBlogPost() {
    // Build a plain object to avoid cloning Vue proxies (which can throw DataCloneError)
    // Ensure content is a JSON object (for jsonb column)
    let contentObj: any = newPost.value.content;
    if (typeof contentObj === "string") {
      try {
        contentObj = JSON.parse(contentObj);
      } catch {
        // if parsing fails, fall back to null to avoid invalid JSON
        contentObj = null;
      }
    }

    const payload = {
      title: newPost.value.title,
      slug: newPost.value.slug,
      summary: newPost.value.summary,
      content: contentObj, // jsonb-compatible object
      metadata: newPost.value.metadata,
      published: !!newPost.value.published,
    };

    const { data, error } = await supabase.from("blog_posts").insert(payload).select();
    if (error) {
      console.error("Insert error", error);
      notificationStore.notify("Blog post failed!", "error");
    } else {
      notificationStore.notify("Blog post submitted!", "success");
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    }
  }
</script>
<template>
  <UiCard class="resize">
    <UiCardContent>
      <form class="space-y-4" @submit.prevent="submitBlogPost">
        <div>
          <UiLabel for="title" class="block text-sm font-medium text-gray-700">Title</UiLabel>
          <UiInput
            type="text"
            id="title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            v-model="newPost.title"
          />
        </div>
        <div>
          <UiLabel for="slug" class="block text-sm font-medium text-gray-700">Slug</UiLabel>
          <UiInput
            type="text"
            id="slug"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            v-model="newPost.slug"
          />
        </div>
        <div>
          <UiLabel for="summary" class="block text-sm font-medium text-gray-700">Summary</UiLabel>
          <UiInput
            type="text"
            id="summary"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            v-model="newPost.summary"
          />
        </div>
        <div>
          <UiLabel for="content" class="block text-sm font-medium text-gray-700">Content</UiLabel>
          <UiTiptap
            v-model="newPost.content"
            :modelType="'json'"
            placeholder="Add notes..."
            hideToolbar
            class="h-48 !min-h-48"
          />
        </div>
        <div class="flex items-center gap-2">
          <UiCheckbox id="published" v-model="newPost.published" name="published" />
          <UiLabel for="published">
            <span class="mt-0.5 ml-2">Publish</span>
          </UiLabel>
        </div>

        <UiButton type="submit">Submit Blog Post</UiButton>
      </form>
    </UiCardContent>
  </UiCard>
</template>
