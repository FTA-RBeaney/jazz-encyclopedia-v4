<script setup>
  definePageMeta({
    layout: "admin",
  });
</script>

<template>
  <UiContainer class="py-6">
    <div class="flex justify-between">
      <h1 class="mb-6 text-3xl font-bold">Add New Post</h1>
    </div>
    <div class="col-span-12 max-w-6xl md:col-span-7">
      <BlogAddForm />
    </div>
  </UiContainer>
</template>
