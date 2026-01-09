<script setup lang="ts">
  import { useMutation, useQueryClient } from "@tanstack/vue-query";

  definePageMeta({
    layout: "admin",
  });

  const supabase = useSupabaseClient();
  const notificationStore = useNotificationStore();
  const accountStore = useUserStore();
  const { userId } = storeToRefs(accountStore);
  const queryClient = useQueryClient();
  const title = ref("");
  const author = ref("");
  const description = ref("");
  const tags = ref([]);
  const link = ref("");
  const image_path = ref("");

  const addArticle = async (article) => {
    const { data, error } = await supabase.from("articles").insert([article]);
    if (error) throw error;
    return data;
  };

  const routeByType = {
    article: "articles",
    book: "books",
    video: "videos",
    documentary: "documentaries",
  };

  const tagsInputId = "tags-input";

  const mutation = useMutation({
    mutationFn: addArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      notificationStore.notify("Article added!", "success");
      setTimeout(() => {
        navigateTo(`/${routeByType[articleType.value] ?? "articles"}`, { replace: true });
      }, 1000);
    },
    onError: (error) => {
      console.error(error);
      notificationStore.notify("Error adding article", "destructive");
    },
  });

  const submitArticle = () => {
    const { data: publicUrlData } = supabase.storage.from("image").getPublicUrl(image_path.value);
    if (
      !title.value ||
      !author.value ||
      !description.value ||
      !link.value ||
      !image_path.value ||
      tags.value.length === 0
    ) {
      notificationStore.notify("Please fill in all fields", "destructive");
      return;
    } else {
      mutation.mutate({
        title: title.value,
        author: author.value,
        description: description.value,
        link: link.value,
        image: publicUrlData.publicUrl,
        tags: tags.value,
        created_by: userId.value,
        type: articleType.value,
      });
    }
  };

  const articleTypes = ["article", "book", "video", "documentary"];
  const articleType = ref("article");

  const crumbs = [
    {
      label: "Home",
      click: () => {
        console.log("clicked");
      },
    },
    { label: "Admin", link: "/admin" },
    {
      label: "Add Article",
      link: "/admin/add-article",
      icon: "heroicons:squares-plus",
      disabled: true,
    },
  ];
</script>

<template>
  <form @submit.prevent="submitArticle">
    <div class="w-full border-b bg-white py-4">
      <UiContainer class="flex max-w-full justify-between">
        <div class="space-y-4">
          <UiBreadcrumbs :items="crumbs" />
          <h1 class="text-2xl font-bold">Add Article</h1>
        </div>
        <div class="flex items-center gap-2">
          <!-- <UiButton type="button" variant="destructive">Delete</UiButton> -->
          <UiButton type="submit">Add Article</UiButton>
        </div>
      </UiContainer>
    </div>
    <UiContainer class="mt-5 max-w-full">
      <div class="">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-8 space-y-4">
            <div class="space-y-4 rounded-lg border bg-white p-4">
              <div class="flex flex-col space-y-1.5">
                <UiLabel for="title">Title</UiLabel>
                <UiInput id="title" type="text" v-model="title" placeholder="" />
              </div>

              <div class="flex flex-col space-y-1.5">
                <UiLabel for="link">Link</UiLabel>
                <UiInput id="link" type="text" v-model="link" placeholder="" />
              </div>

              <div class="flex flex-col space-y-1.5">
                <UiLabel for="author">Author</UiLabel>
                <UiInput id="author" type="text" v-model="author" placeholder="" />
              </div>

              <div class="flex flex-col space-y-1.5">
                <UiLabel for="description">Description</UiLabel>
                <div>
                  <UiTiptap v-model="description" class="h-96" />
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-4 space-y-4">
            <div class="rounded-lg border bg-white p-0">
              <UploadImage v-model:path="image_path" class="col-span-4" />
            </div>

            <div class="space-y-4 rounded-lg border bg-white p-4">
              <div class="flex flex-col space-y-1.5">
                <UiLabel for="tags">Article type</UiLabel>
                <UiSelect v-model="articleType">
                  <UiSelectTrigger class="w-full">
                    <UiSelectValue placeholder="Select article type" />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <UiSelectItem v-for="type in articleTypes" :key="type" :value="type">
                      {{ type.charAt(0).toUpperCase() + type.slice(1) }}
                    </UiSelectItem>
                  </UiSelectContent>
                </UiSelect>
              </div>
              <div class="flex flex-col space-y-1.5">
                <UiLabel for="tags">Tags</UiLabel>
                <UiTagsInput
                  v-model="tags"
                  class="focus-within:border-ring focus-within:ring-ring/50 h-auto p-1 shadow-xs outline-none focus-within:ring-[3px]"
                >
                  <UiTagsInputItem v-for="tag in tags" :key="tag" :value="tag" />

                  <UiTagsInputInput
                    :id="tagsInputId"
                    placeholder="Add tags..."
                    class="h-7 min-w-20 px-2 dark:bg-transparent"
                    type="text"
                  />
                </UiTagsInput>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UiContainer>
  </form>
</template>
