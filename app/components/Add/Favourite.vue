<script setup lang="ts">
  const props = defineProps<{
    postId: string;
    type: string;
    name: string;
  }>();

  const notificationStore = useNotificationStore();
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const isFavourited = ref(false);

  const handleAddFavourites = async () => {
    const user = useSupabaseUser();
    if (!user.value) {
      alert("You must be logged in to add favourites.");
      notificationStore.notify("You *:must: be logged in to add favourites", "error");
      return;
    }

    const { error } = await supabase.from("favourites").insert({
      favourite_id: user.value.sub + props.postId,
      user_id: user.value.sub,
      post_id: props.postId,
      name: props.name,
      type: props.type,
    });

    if (error) {
      notificationStore.notify("Error adding to favourites!", "error");
    } else {
      notificationStore.notify("Musician added to favourites!", "success");
      refetchFavourite();
    }
  };

  const { data: favourite, refetch: refetchFavourite } = useQuery({
    queryKey: ["favouriteStatus", props.postId],
    queryFn: async () => {
      const user = useSupabaseUser();
      if (!user.value) return false;

      const { data, error } = await supabase
        .from("favourites")
        .select("favourite_id")
        .eq("user_id", user.value.sub)
        .eq("post_id", props.postId)
        .maybeSingle();
      if (error || !data) return false; // Always return something

      if (data) {
        isFavourited.value = true;
      } else {
        isFavourited.value = false;
      }
      return isFavourited.value;
    },

    enabled: !!user.value && !!props.postId,
  });

  function checkFavourites() {
    refetchFavourite();
  }
  onMounted(() => {
    checkFavourites();
  });
</script>

<template>
  <UiButton
    @click="handleAddFavourites"
    :class="isFavourited ? 'bg-green-600' : 'bg-primary'"
    :disabled="isFavourited"
  >
    <Icon name="lucide:heart" class="mr-2" />
    {{ isFavourited ? "Favourited!" : "Add to favourites" }}
  </UiButton>
</template>
