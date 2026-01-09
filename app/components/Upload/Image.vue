<script setup>
  const props = defineProps(["path"]);
  const { path } = toRefs(props);

  const emit = defineEmits(["update:path", "upload"]);

  const supabase = useSupabaseClient();

  const uploading = ref(false);
  const src = ref("");
  const files = ref();

  const downloadImage = async () => {
    try {
      const { data, error } = await supabase.storage.from("image").download(path.value);
      if (error) throw error;
  const previousObjectUrl = ref(null);

  const downloadImage = async () => {
    try {
      const { data, error } = await supabase.storage.from("image").download(path.value);
      if (error) throw error;
      if (previousObjectUrl.value) {
        URL.revokeObjectURL(previousObjectUrl.value);
      }
      previousObjectUrl.value = URL.createObjectURL(data);
      src.value = previousObjectUrl.value;
    } catch (error) {
      console.error("Error downloading image: ", error.message);
    }
  };

  onUnmounted(() => {
    if (previousObjectUrl.value) {
      URL.revokeObjectURL(previousObjectUrl.value);
    }
  });
    } catch (error) {
      console.error("Error downloading image: ", error.message);
    }
  };

  const uploadAvatar = async (evt) => {
    files.value = evt.target.files;
    try {
      uploading.value = true;

      if (!files.value || files.value.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = files.value[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from("image").upload(filePath, file);

      if (uploadError) throw uploadError;

      // Generate public URL for the uploaded image
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("image")
        .getPublicUrl(filePath);

      if (publicUrlError) throw publicUrlError;

      // Update the src to display the uploaded image
      src.value = publicUrlData.publicUrl;

      emit("update:path", filePath);
      emit("upload");
    } catch (error) {
      alert(error.message);
    } finally {
      uploading.value = false;
    }
  };

  onMounted(() => {
    // if (path.value) {
    //   downloadImage();
    // }
  });

  watch(path, () => {
    if (path.value) {
      downloadImage();
    }
  });
</script>

<template>
  <div class="w-full">
    <div class="">
      <label for="picture" class="relative cursor-pointer">
        <div class="aspect-video w-full">
          <img
            v-if="src || path"
            :src="src || path"
            alt="Avatar"
            class="image avatar h-full w-full overflow-hidden rounded-lg object-cover"
          />
          <img
            v-else
            src="https://flowbite.com/docs/images/examples/image-1@2x.jpg"
            alt="Avatar"
            class="h-full w-full overflow-hidden rounded-lg object-cover"
          />
        </div>
        <UiInput
          id="picture"
          type="file"
          accept="image/*"
          @change="uploadAvatar"
          :disabled="uploading"
          class="hidden"
        />
        <UiLabel
          for="picture"
          class="absolute inset-0 flex items-center justify-center !text-4xl font-bold text-slate-50"
        >
          <!-- {{ uploading ? "Uploading ..." : "Upload image" }} -->
          <div v-if="uploading">
            <div
              class="absolute top-0 left-0 h-full w-full overflow-hidden rounded-lg bg-black/50"
            ></div>
            <Icon name="lucide:loader" class="size-6 animate-spin" />
          </div>
          <div
            v-else
            class="flex items-center justify-center overflow-hidden rounded-full bg-green-500 p-2"
          >
            <Icon name="lucide:upload" class="size-6" />
          </div>
        </UiLabel>
      </label>
    </div>
  </div>
</template>
