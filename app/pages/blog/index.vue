<script setup lang="ts">
  definePageMeta({
    layout: "admin",
  });

  // assume user is signed in; auth automatically attaches JWT
  const supabase = useSupabaseClient();
  const notificationStore = useNotificationStore();
  const showToast = () => {
    notificationStore.notify("Blog post failed!", "error");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, author(*)")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const blogPostAuthor = (author?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  }) => {
    if (!author) return [];
    return [
      {
        name: `${author.first_name} ${author.last_name}`,
        avatar: {
          src: author.avatar_url,
        },
      },
    ];
  };
</script>

<template>
  <UiContainer v-if="isLoading" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else class="h-full max-w-full">
    <div class="m-6">
      <UiCard class="resize">
        <UiCardContent>
          <CardHeader title="Blog" description="Latest blog posts">
            <UiButton :to="'/blog/add'">Add New Post</UiButton>
          </CardHeader>

          <UiSeparator class="my-4" />

          <!-- <BlogListTable :data="data" /> -->

          <UBlogPosts orientation="vertical" class="lg:gap-0">
            <UBlogPost
              v-for="post in data"
              :key="post.id"
              :title="post.title"
              :description="post.summary"
              :date="post.published_at"
              :to="`/blog/${post.slug}`"
              :authors="blogPostAuthor(post.author)"
              variant="ghost"
              :ui="{ title: 'text-sm', description: 'text-xs' }"
            />
          </UBlogPosts>
        </UiCardContent>
      </UiCard>
    </div>
  </UiContainer>
</template>
