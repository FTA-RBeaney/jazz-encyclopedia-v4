<script setup>
  const { profile } = useUserStore();
  const user = computed(() => profile);

  definePageMeta({
    layout: "admin",
  });
</script>
<template>
  <div><Hero /></div>
</template>
