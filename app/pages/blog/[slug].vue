<script setup lang="ts">
  import { generateHTML } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import { useDateFormat } from "@vueuse/core";
  import { useSupabaseClient } from "#imports";
  import { computed, ref } from "vue";
  import { useRoute } from "vue-router";

  definePageMeta({
    layout: "admin",
  });

  const route = useRoute();
  const supabase = useSupabaseClient();
  const slug = route.params.slug;

  const error = ref("");

  const { data, isLoading } = useQuery({
    queryKey: ["blog_posts", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`*, profiles(*)`)
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data ?? [];
    },
  });

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

  const crumbs = computed(() => [
    {
      disabled: true,
      icon: "heroicons:home",
    },
    {
      label: "Blogs",
      link: "/blog",
      disabled: false,
    },
    {
      label: data?.value?.title ?? "",
      link: `/blog/${data?.value?.slug ?? ""}`,
      disabled: true,
    },
  ]);
</script>

<template>
  <main class="mx-6 pt-6 pb-16 antialiased lg:pb-24 dark:bg-gray-900">
    <UiCard class="resize">
      <UiCardContent>
        <div class="mx-auto flex max-w-screen-xl justify-between px-4">
          <div
            class="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert mx-auto w-full max-w-2xl"
          >
            <UiBreadcrumbs :items="crumbs" class="my-6" />
            <div v-if="isLoading">Loading...</div>
            <div v-else-if="error">{{ error }}</div>
            <article v-else>
              <header class="not-format mb-4 lg:mb-6">
                <address class="mb-6 flex items-center not-italic">
                  <div class="mr-3 inline-flex items-center text-sm text-gray-900 dark:text-white">
                    <img
                      class="mr-4 h-16 w-16 rounded-full"
                      :src="data?.profiles?.avatar_url"
                      alt="Jese Leos"
                    />
                    <div>
                      <p class="text-xl font-bold text-gray-900 dark:text-white">
                        {{ data?.profiles?.first_name + " " + data?.profiles?.last_name }}
                      </p>
                      <p class="text-base text-gray-500 capitalize dark:text-gray-400">
                        {{ data?.profiles?.user_role }}
                      </p>
                      <p class="text-base text-gray-500 dark:text-gray-400">
                        <time pubdate datetime="2022-02-08" title="February 8th, 2022"
                          >{{ useDateFormat(data?.created_at, "ddd MMM YYYY") }}
                        </time>
                      </p>
                    </div>
                  </div>
                </address>
                <h1
                  class="mb-4 text-3xl leading-tight font-extrabold text-gray-900 lg:mb-6 lg:text-4xl dark:text-white"
                >
                  {{ data?.title }}
                </h1>
              </header>
              <div class="tiptap" v-dompurify-html="contentHtml" />
            </article>
          </div>
        </div>
      </UiCardContent>
    </UiCard>
  </main>
</template>

<style>
  @reference "tailwindcss";

  .tiptap p {
    @apply my-2 text-base leading-normal first:mt-0 last:mb-0;
  }
  .tiptap h1 {
    @apply mt-4 mb-2 text-2xl font-bold first:mt-0 last:mb-0;
  }
  .tiptap h2 {
    @apply mt-3 mb-2 text-xl font-semibold first:mt-0 last:mb-0;
  }
  .tiptap h3 {
    @apply mt-3 mb-2 text-lg font-semibold first:mt-0 last:mb-0;
  }
  .tiptap h4 {
    @apply mt-2.5 mb-1.5 text-base font-semibold first:mt-0 last:mb-0;
  }
  .tiptap h5 {
    @apply mt-2 mb-1 text-sm font-semibold first:mt-0 last:mb-0;
  }
  .tiptap h6 {
    @apply mt-2 mb-1 text-xs font-semibold first:mt-0 last:mb-0;
  }
  .tiptap a {
    @apply text-blue-600 underline;
  }
  .tiptap ul {
    @apply my-4 list-disc pl-6;
  }
  .tiptap ol {
    @apply my-4 list-decimal pl-6;
  }
</style>
