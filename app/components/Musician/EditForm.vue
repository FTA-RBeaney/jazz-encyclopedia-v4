<script setup lang="ts">
  const emit = defineEmits<{
    (e: "update:pageIsBeingEdited", value: boolean): void;
  }>();

  const props = defineProps<{
    data: {
      id: string;
      name: string;
      content: string;
    };
  }>();

  interface FormData {
    name: string;
    content: string;
  }

  // convert props to reactive
  const formData = reactive<FormData>({
    name: props.data.name ?? "",
    content: props.data.content ?? {},
  });
  const notificationStore = useNotificationStore();
  const client = useSupabaseClient();
  const route = useRoute();

  const handleEdit = () => {
    emit("update:pageIsBeingEdited", false);
  };

  const handleUpdate = async () => {
    let contentObj = formData.content;

    if (typeof contentObj === "string") {
      try {
        contentObj = JSON.parse(contentObj);
      } catch {
        // if parsing fails, fall back to null to avoid invalid JSON
        contentObj = null;
      }
    }

    const payload = {
      name: formData.name,
      content: contentObj, // jsonb-compatible object
    };

    const { error } = await client.from("musicians").update(payload).eq("id", route.params.id);

    if (error) {
      console.error("Update error", error);
      notificationStore.notify("Error updating musician!", "destructive");
    } else {
      notificationStore.notify("Musician updated successfully", "success");
      // send the pageIsBeingEdited state back to parent to false
      emit("update:pageIsBeingEdited", false);
    }
  };
</script>

<template>
  <div class="tiptap-container grow">
    <form>
      <UiFieldGroup>
        <UiField>
          <UiFieldLabel for="checkout-7j9-card-name-43j"> Name </UiFieldLabel>
          <UiInput id="checkout-7j9-card-name-43j" v-model="formData.name" required />
        </UiField>

        <UiTiptap v-model="formData.content" :modelType="'json'" placeholder="Add notes..." />
      </UiFieldGroup>
    </form>
    <div class="mt-4 flex justify-end gap-2">
      <UiButton color="primary" @click="handleUpdate">Save</UiButton>
      <UiButton variant="secondary" @click="handleEdit">Cancel</UiButton>
    </div>
  </div>
</template>
