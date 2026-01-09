<script setup>
  definePageMeta({
    layout: "admin",
  });

  const supabase = useSupabaseClient();

  // get data from the feedback table from supabase
  const { data, isLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select(`*, profiles(*)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
</script>

<template>
  <div class="container mx-auto p-8">
    <div class="grid grid-cols-1 gap-4 md:flex md:items-center md:justify-between">
      <div class="flex flex-col">
        <h1 class="font-semibold">Feedback</h1>
        <p class="text-muted-foreground text-sm">
          Add, read and edit bugs and feature requests from users.
        </p>
      </div>
      <div>
        <AddBug button-text="Add a bug" />
      </div>
    </div>

    <ClientOnly>
      <template #fallback>
        <div class="flex items-center justify-center py-8">Loading...</div>
      </template>
      <FeedbackTable v-if="!isLoading" :data="data" />
    </ClientOnly>
  </div>
</template>
