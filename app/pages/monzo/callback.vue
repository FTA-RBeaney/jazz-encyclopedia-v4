<script setup lang="ts">
  import { onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";

  import { useMonzoAuthFlow } from "../../composables/useMonzoAuthFlow";

  const route = useRoute();
  const router = useRouter();
  const { handleCallback, error } = useMonzoAuthFlow();

  onMounted(async () => {
    const code = route.query.code;
    if (code) {
      await handleCallback(code as string);
      if (!error.value) {
        router.replace("/transactions");
      }
    }
  });
</script>

<template>
  <div class="flex min-h-[40vh] flex-col items-center justify-center">
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <p v-else>Connecting to Monzo...</p>
  </div>
</template>
