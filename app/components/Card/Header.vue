<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
  });
</script>
<template>
  <div class="flex items-center justify-between">
    <div class="space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight">{{ title }}</h2>
      <p class="text-muted-foreground text-sm">
        {{ description }}
      </p>
    </div>
    <slot />
  </div>
</template>
