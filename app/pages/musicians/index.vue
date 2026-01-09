<script setup>
  definePageMeta({
    layout: "admin",
  });
  const notificationStore = useNotificationStore();
  const supabase = useSupabaseClient();

  const { data, status, pending, error, refresh, clear } = await useAsyncData(
    "musicians",
    async () => {
      const { data, error } = await supabase.from("musicians").select("*");
      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  );

  const isOpen = ref(false);
  const newMusician = ref({
    name: "",
  });

  const handleSubmit = async () => {
    const { error } = await supabase.from("musicians").insert([newMusician.value]);

    if (error.code === "23505") {
      isOpen.value = false;
      notificationStore.notify(`${newMusician.value.name} already exists!`, "error");
      return;
    }

    if (error) {
      console.log(error);
      isOpen.value = false;
      notificationStore.notify(`Error adding musician: ${error.message}`, "error");
      return;
    }

    notificationStore.notify(`Musician ${newMusician.value.name} added successfully!`, "success");
    isOpen.value = false;
  };
</script>

<template>
  <UiContainer v-if="pending" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else-if="data" class="h-full max-w-full">
    <div class="m-6">
      <UiCard class="resize">
        <UiCardContent>
          <div class="mb-4 flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">Musicians</h2>
              <p class="text-muted-foreground text-sm">Latest videos uploaded by users</p>
            </div>
            <div class="flex gap-2">
              <UiDialog v-model:open="isOpen">
                <UiDialogTrigger as-child>
                  <UiButton @click="open = true"
                    ><Icon name="lucide:plus" class="h-4 w-4" /> Add a new musician
                  </UiButton>
                </UiDialogTrigger>
                <UiDialogContent class="sm:max-w-[425px]">
                  <UiDialogHeader>
                    <UiDialogTitle>Add a musician</UiDialogTitle>
                    <UiDialogDescription> Add the details below </UiDialogDescription>
                  </UiDialogHeader>
                  <form class="space-y-4" @submit.prevent="handleSubmit">
                    <div>
                      <UiLabel for="name" class="block text-sm font-medium text-gray-700"
                        >Name</UiLabel
                      >
                      <UiInput
                        type="text"
                        id="name"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        v-model="newMusician.name"
                      />
                    </div>
                  </form>
                  <UiDialogFooter>
                    <UiButton type="submit" @click="handleSubmit">Add Musician</UiButton>
                  </UiDialogFooter>
                </UiDialogContent>
              </UiDialog>
            </div>
          </div>
          <MusicianTable :musicians="data" />
        </UiCardContent>
      </UiCard>
    </div>
  </UiContainer>
</template>
