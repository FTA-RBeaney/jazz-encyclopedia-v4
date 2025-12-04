<script lang="ts" setup>
  definePageMeta({
    layout: "admin",
  });
  interface Article {
    id: string;
    title: string;
    image?: string;
    description?: string;
    link: string;
    type: string;
  }

  const { getArticlesOfType } = useFetchArticles();
  const { data: articles, isLoading } = getArticlesOfType("book");

  // Create a computed property that properly types the articles
  const typedArticles = computed(() => (articles?.value as Article[]) || []);

  const userImage = "https://api.dicebear.com/7.x/lorelei/svg?flip=false";
</script>

<template>
  <UiContainer v-if="isLoading" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else class="h-full max-w-full">
    <div class="m-6">
      <UiCard class="resize">
        <UiCardContent>
          <CardHeader title="Books" description="Latest resources, including articles and books" />
          <UiSeparator class="my-4" />
          <section class="grid grid-cols-5 gap-2 space-y-6">
            <template v-for="article in typedArticles" :key="article.id">
              <div>
                <NuxtLink :to="article.link" target="_blank" class="relative">
                  <img
                    v-if="article.image"
                    :src="article.image"
                    :alt="article.title"
                    class="mb-5 aspect-video w-full rounded-lg object-cover shadow"
                  />
                  <img
                    v-else
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    :alt="article.title"
                    class="mb-5 h-[240px] w-full rounded-lg object-cover shadow"
                  />
                </NuxtLink>
                <NuxtLink :to="article.link" target="_blank">
                  <p class="lg:text-md text-md mb-2 font-semibold">{{ article.title }}</p>
                </NuxtLink>

                <div
                  v-if="article.description"
                  class="text-muted-foreground mb-5 line-clamp-2 text-xs text-ellipsis"
                  v-html="article.description"
                ></div>
                <div class="flex items-center">
                  <UiAvatar
                    v-if="article.author && article.authorImage"
                    :src="article.authorImage"
                    :alt="article.author"
                    class="bg-background ring-ring/30 mr-3 rounded-full shadow ring-1"
                  />
                  <UiAvatar
                    v-else="userImage"
                    :src="userImage"
                    :alt="userName"
                    class="bg-background ring-ring/30 mr-3 rounded-full shadow ring-1"
                  />
                  <div>
                    <p v-if="article.author" class="text-xs font-semibold">{{ article.author }}</p>
                    <p v-if="article.date" class="text-muted-foreground text-sm">
                      {{ article.date }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </section>
        </UiCardContent>
      </UiCard>
    </div>
  </UiContainer>
</template>
