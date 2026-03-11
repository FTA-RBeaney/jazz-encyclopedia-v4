<script setup>
  import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

  import { useNotificationStore } from "../../stores/notification.store";

  const supabaseUser = useSupabaseUser();
  const supabase = useSupabaseClient();
  const route = useRoute();

  const payload = ref("");

  const notificationStore = useNotificationStore();
  const queryClient = useQueryClient();

  const {
    isPending: isSubmitting,
    isError: mutationIsError,
    error: mutationError,
    isSuccess: isSubmitted,
    mutate: addComment,
  } = useMutation({
    mutationFn: async (comment) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const dataToPost = {
        post_id: route.params.slug || route.params.id,
        payload: payload.value,
        email: session.user.email,
        user_id: session.user.id,
      };

      const { error } = await supabase.from("comments").insert([dataToPost]);
      if (error) throw error;
    },
    onSuccess: () => {
      payload.value = "";
      queryClient.invalidateQueries({ queryKey: ["comments", route.params.id] });
      notificationStore.notify("Comment submitted!", "success");
    },
    onError: (error) => {
      console.error(error);
      notificationStore.notify("Error submitting comment", "destructive");
    },
  });

  function handleAdd() {
    if (!supabaseUser.value) {
      notificationStore.notify("You must be logged in to comment", "destructive");
      return;
    }
    addComment();
  }

  defineProps({
    comments: {
      type: Array,
      required: true,
    },
  });
</script>

<template>
  <div class="mx-auto max-w-screen-xl">
    <section
      class="relative mt-0 flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 pb-6 dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="flex w-full items-start justify-start">
        <div class="w-full">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 lg:text-xl dark:text-white">
              Discussion ({{ comments?.length }})
            </h2>
          </div>
          <form @submit.prevent="handleAdd" class="mb-6">
            <div
              class="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              <label for="comment" class="sr-only">Your comment</label>
              <textarea
                id="comment"
                rows="6"
                class="w-full border-0 px-0 text-sm text-gray-900 focus:ring-0 focus:outline-none dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a comment..."
                v-model="payload"
                required
              ></textarea>
            </div>

            <UiButton type="submit">Post comment</UiButton>
          </form>
        </div>
      </div>
    </section>
    <section>
      <div v-if="comments?.length > 0" class="container mx-auto px-0">
        <CommentsComment
          v-for="(comment, i) in comments"
          :key="comment.id"
          :comment="comment"
          :is-last="i === comments?.length - 1 && true"
          :user-id="supabaseUser?.sub"
          :route-id="route.params.id"
        />
      </div>
      <p v-else class="mt-6 text-center">No comments yet...</p>
    </section>
  </div>
</template>
