<script setup>
  const { profile } = useUserStore();
  const user = computed(() => profile);
</script>
<template>
  <div>
    <h1>Home</h1>
    <div v-if="sbUser">
      <p>Logged in as {{ user.email }}</p>
    </div>
  </div>
</template>
