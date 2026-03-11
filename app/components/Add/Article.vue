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
  const isOpen = ref(false);

  const addArticle = async (article) => {
    const { data, error } = await supabase.from("articles").insert([article]).select();
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
      isOpen.value = false;
    },
    onError: (error) => {
      console.error(error);
      notificationStore.notify("Error adding article", "destructive");
    },
  });

  const submitArticle = () => {
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
        image: `https://misyrpoxvyxwrnhnmeww.supabase.co/storage/v1/object/public/image/${image_path.value}`,
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
  <div>
    <UiDialog v-model:open="isOpen">
      <UiDialogTrigger as-child>
        <UiButton variant="outline" class="w-full">
          <Icon name="lucide:plus" class="mr-0 h-4 w-4" />Feedback
        </UiButton>
      </UiDialogTrigger>
      <UiDialogContent
        class="flex flex-col gap-0 p-0 sm:max-h-[min(80vh,80vh)] sm:max-w-lg [&>button:last-child]:hidden"
      >
        <UiDialogHeader>
          <UiDialogTitle class="px-6 pt-6 text-base">Add Article</UiDialogTitle>
        </UiDialogHeader>
        <form @submit.prevent="submitArticle">
          <div class="col-span-8 space-y-4">
            <div class="space-y-4 p-4">
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
            <div class="rounded-lg bg-white p-4">
              <UploadImage v-model:path="image_path" class="col-span-4" />
            </div>

            <div class="space-y-4 p-4">
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
        </form>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
