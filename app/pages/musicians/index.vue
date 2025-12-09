<script setup>
  definePageMeta({
    layout: "admin",
  });
  const client = useSupabaseClient();
  const { data, status, pending, error, refresh, clear } = await useAsyncData(
    "musicians",
    async () => {
      const { data, error } = await client.from("musicians").select("*");

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  );
</script>

<template>
  <UiContainer v-if="pending" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else-if="data" class="h-full max-w-full">
    <div class="m-6">
      <UiCard class="resize">
        <UiCardContent>
          <MusicianTable :musicians="data" />
        </UiCardContent>
      </UiCard>
    </div>
  </UiContainer>
</template>
