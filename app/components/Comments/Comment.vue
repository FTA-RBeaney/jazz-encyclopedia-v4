<script setup>
  const supabase = useSupabaseClient();

  const props = defineProps({
    comment: Object,
    isLast: Boolean,
    userId: String,
    routeId: String,
  });

  const date = computed(() =>
    new Date(props.comment.created_at).toLocaleDateString("en-UK", {
      timeZone: "GMT",
    })
  );

  const isLiked = ref(false);

  const likeId = computed(() => props.userId + props?.comment?.id);

  const { count: numberOfLikes } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", props.comment.id);

  // check likes table to see if current page is a favourite
  const { data, error, count } = await supabase
    .from("likes")
    .select("id", { count: "exact", head: true })
    .eq("id", likeId.value);

  if (count > 0) {
    isLiked.value = true;
  }

  const addLike = async () => {
    isLiked.value = true;
    const newNumberOfLikes = numberOfLikes + 1;

    const { data: addLike, error: likeError } = await supabase
      .from("likes")
      .insert({
        id: likeId.value,
        user_id: props.userId,
        post_id: props.routeId,
      })
      .select();

    const { data, error } = await supabase
      .from("comments")
      .update({ likes: newNumberOfLikes })
      .eq("id", props.comment.id)
      .select();
  };

  const removeLike = async () => {
    isLiked.value = false;
    const newNumberOfLikes = numberOfLikes + 1;

    const { error: likeError } = await supabase.from("likes").delete().eq("id", likeId.value);

    if (likeError) {
      console.log(likeError);
    }

    const { data, error } = await supabase
      .from("comments")
      .update({ likes: newNumberOfLikes })
      .eq("id", props.comment.id)
      .select();
  };

  const isCurrentUser = computed(() => props.userId === props.comment.user_id);
</script>
<template>
  <div
    class="relative mx-auto mt-4 mb-4 flex h-full w-full flex-col gap-2 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 pb-6 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="flex flex-row pt-1">
      <UiAvatar class="!rounded-md">
        <UiAvatarImage :src="comment.profiles.avatar_url" />
        <UiAvatarFallback>
          {{ comment.profiles.first_name.charAt(0) }}
        </UiAvatarFallback>
      </UiAvatar>

      <div class="mt-0 flex-col">
        <div class="items-center px-4 leading-tight font-bold">
          <div>
            {{ comment.profiles.first_name }}
          </div>
          <span class="text-xs font-normal text-gray-500">{{ date }}</span>
        </div>
      </div>

      <div>
        <UiButton
          v-if="isCurrentUser"
          class="absolute top-2 right-2"
          size="xs"
          variant="ghost"
          @click="$emit('delete', comment.id)"
        >
          <Icon name="lucide:trash-2" />
        </UiButton>
      </div>
    </div>
    <div class="flex-1 text-sm leading-loose font-medium text-gray-600">
      {{ comment.payload }}
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <UiButton
          size="xs"
          variant="link"
          class="m-0 !p-0"
          @click="isLiked ? removeLike() : addLike()"
        >
          <Icon :name="isLiked ? 'mdi:heart' : 'lucide:heart'" />
        </UiButton>
        <span class="text-xs text-gray-500"
          >{{ numberOfLikes }} {{ numberOfLikes === 1 ? "like" : "likes" }}</span
        >
      </div>
    </div>
  </div>
</template>
