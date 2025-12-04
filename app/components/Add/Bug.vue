<script setup lang="ts">
  import { useQueryClient } from "@tanstack/vue-query";
  import { useSupabaseClient } from "#imports";
  import { computed, ref } from "vue";

  import { useNotificationStore } from "../../stores/notification.store";
  import { useUserStore } from "../../stores/user.store";

  const queryClient = useQueryClient();

  const supabase = useSupabaseClient();
  const notificationStore = useNotificationStore();
  const { profile } = useUserStore();
  const user = computed(() => profile);

  const isOpen = ref(false);
  const loading = ref(false);
  const error = ref("");
  const success = ref(false);

  const title = ref("");
  const feedback = ref("");
  const type = ref("bug");
  const priority = ref("low");

  const types = [
    { label: "Bug", value: "bug", icon: "lucide:bug" },
    { label: "Feature", value: "feature", icon: "lucide:star" },
  ];
  const priorities = [
    { label: "Low", value: "low", icon: "lucide:arrow-down" },
    { label: "Medium", value: "medium", icon: "lucide:minus" },
    { label: "High", value: "high", icon: "lucide:arrow-up" },
  ];

  async function submitFeedback() {
    loading.value = true;
    error.value = "";
    success.value = false;
    const { error: supaError } = await supabase.from("feedback").insert([
      {
        title: title.value,
        feedback: feedback.value,
        type: type.value,
        priority: priority.value,
        status: "to do",
        user_id: user.value?.id,
        created_at: new Date().toISOString(),
      },
    ]);
    queryClient.invalidateQueries({ queryKey: ["feedback"] });
    loading.value = false;
    if (supaError) {
      error.value = supaError.message;
    } else {
      success.value = true;
      title.value = "";
      feedback.value = "";
      type.value = "bug";
      priority.value = "low";
      isOpen.value = false;
      notificationStore.notify("Feedback submitted!", "success");
    }
  }
</script>

<template>
  <div>
    <UiDialog v-model:open="isOpen">
      <UiDialogTrigger as-child>
        <UiButton variant="outline" class="w-full">
          <Icon name="lucide:plus" class="mr-0 h-4 w-4" />Feedback
        </UiButton>
      </UiDialogTrigger>
      <UiDialogContent
        class="flex flex-col gap-0 p-0 sm:max-h-[min(80vh,80vh)] sm:max-w-lg [&>button:last-child]:hidden"
      >
        <UiDialogHeader>
          <UiDialogTitle class="px-6 pt-6 text-base">Add Feedback</UiDialogTitle>
        </UiDialogHeader>
        <form @submit.prevent="submitFeedback">
          <div class="space-y-4 p-6">
            <div class="flex flex-col space-y-1.5">
              <UiLabel for="title">Title</UiLabel>
              <UiInput id="title" v-model="title" type="text" required />
            </div>
            <div class="flex flex-col space-y-1.5">
              <UiLabel for="feedback">Feedback</UiLabel>
              <UiTextarea id="feedback" v-model="feedback" required rows="10" class="h-[100px]" />
            </div>
            <div class="flex gap-4">
              <div class="flex w-full flex-col space-y-1.5">
                <UiLabel for="type">Type</UiLabel>

                <UiSelect id="type" v-model="type" class="w-full rounded border px-3 py-2">
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select type" />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <UiSelectItem v-for="t in types" :key="t.value" :value="t.value">
                      <span v-if="t.icon" class="mr-2">
                        <Icon :name="t.icon" class="inline-block size-4" />
                      </span>
                      {{ t.label }}</UiSelectItem
                    >
                  </UiSelectContent>
                </UiSelect>
              </div>
              <div class="flex w-full flex-col space-y-1.5">
                <UiLabel for="priority">Priority</UiLabel>
                <UiSelect id="priority" v-model="priority" class="w-full rounded border px-3 py-2">
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select priority" />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <UiSelectItem v-for="p in priorities" :key="p.value" :value="p.value">
                      <span v-if="p.icon" class="mr-2">
                        <Icon :name="p.icon" class="inline-block size-4" />
                      </span>
                      {{ p.label }}
                    </UiSelectItem>
                  </UiSelectContent>
                </UiSelect>
              </div>
              <div v-if="error" class="mt-2 text-red-500">{{ error }}</div>
              <div v-if="success" class="mt-2 text-green-600">Feedback submitted!</div>
            </div>
          </div>
          <UiDialogFooter class="border-border border-t px-6 py-4">
            <UiDialogClose as-child>
              <UiButton variant="outline">Cancel</UiButton>
            </UiDialogClose>
            <UiButton type="submit" :disabled="loading">
              <span v-if="loading">Submitting...</span>
              <span v-else>Submit Feedback</span>
            </UiButton>
          </UiDialogFooter>
        </form>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
