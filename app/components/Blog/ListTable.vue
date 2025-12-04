<script setup>
  import { useDateFormat } from "@vueuse/core";

  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  });

  const isPublished = (published) => {
    return published ? "Published" : "Draft";
  };
</script>
<template>
  <article v-for="post in data" :key="post.id" class="flex flex-col items-start justify-between">
    <div class="flex items-center gap-x-4 text-xs">
      <time :datetime="post.datetime" class="text-gray-500">{{
        useDateFormat(post.created_at, "ddd MMM YYYY")
      }}</time>
      <a
        :href="`/blog/${post.slug}`"
        :title="post.slug"
        class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
        >{{ isPublished(post.published) }}</a
      >
    </div>
    <div class="group relative grow">
      <h3 class="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
        <a :href="`/blog/${post.slug}`">
          <span class="absolute inset-0"></span>
          {{ post.title }}
        </a>
      </h3>
      <p class="mt-5 line-clamp-3 text-sm/6 text-gray-600">{{ post.summary }}</p>
    </div>
    <!-- <div class="relative mt-8 flex items-center gap-x-4 justify-self-end">
            <img :src="post.author.imageUrl" alt="" class="size-10 rounded-full bg-gray-50" />
            <div class="text-sm/6">
              <p class="font-semibold text-gray-900">
                <a :href="post.author.href">
                  <span class="absolute inset-0"></span>
                  {{ post.author.name }}
                </a>
              </p>
              <p class="text-gray-600">{{ post.author.role }}</p>
            </div>
          </div> -->
  </article>
</template>
