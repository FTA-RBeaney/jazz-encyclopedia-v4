<script lang="ts" setup>
  definePageMeta({
    layout: "admin",
  });
  interface Documentary {
    id: string;
    title: string;
    image?: string;
    description?: string;
    link: string;
    type: string;
    author?: string;
    authorImage?: string;
    date?: string;
  }

  const { getAllDocumentaries } = useFetchDocumentaries();
  const { data: documentaries, isLoading } = getAllDocumentaries();

  // Create a computed property that properly types the articles
  const typedDocumentaries = computed(() => (documentaries?.value as Documentary[]) || []);
</script>

<template>
  <UiContainer v-if="isLoading" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else class="h-full max-w-full">
    <div class="m-6">
      <UiCard class="resize">
        <UiCardContent>
          <CardHeader
            title="Documentaries"
            description="Latest resources, including articles and videos"
          />
          <UiSeparator class="my-4" />
          <section class="grid grid-cols-5 gap-2 space-y-6">
            <template v-for="documentary in typedDocumentaries" :key="documentary.id">
              <div>
                <NuxtLink :to="documentary.link" target="_blank" class="relative">
                  <img
                    v-if="documentary.image"
                    :src="documentary.image"
                    :alt="documentary.title"
                    class="mb-5 aspect-video w-full rounded-lg object-cover shadow"
                  />
                  <img
                    v-else
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    :alt="documentary.title"
                    class="mb-5 h-[240px] w-full rounded-lg object-cover shadow"
                  />
                </NuxtLink>
                <NuxtLink :to="documentary.link" target="_blank">
                  <p class="lg:text-md text-md mb-2 font-semibold">{{ documentary.title }}</p>
                </NuxtLink>

                <div
                  v-if="documentary.description"
                  class="text-muted-foreground line-clamp-2 text-xs text-ellipsis"
                  v-dompurify-html="documentary.description"
                ></div>
                <div class="flex items-center">
                  <UiAvatar
                    v-if="documentary.author && documentary.authorImage"
                    :src="documentary.authorImage"
                    :alt="documentary.author"
                    class="bg-background ring-ring/30 mr-3 rounded-full shadow ring-1"
                  />

                  <div>
                    <p v-if="documentary.author" class="text-xs font-semibold">
                      {{ documentary.author }}
                    </p>
                    <p v-if="documentary.date" class="text-muted-foreground text-sm">
                      {{ documentary.date }}
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
