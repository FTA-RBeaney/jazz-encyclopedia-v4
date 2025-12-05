<script setup lang="ts">

  const user = useSupabaseUser();
    const userStore = useUserStore();

    // Get redirect path from cookies
    const cookieName = useRuntimeConfig().public.supabase.cookieName;
    const redirectPath = useCookie(`${cookieName}-redirect-path`).value;

    watch(
      user,
      async () => {
        if (user.value) {
          // Fetch profile and store it
          await userStore.fetchProfile(user.value.id);
          // Clear cookie
          useCookie(`${cookieName}-redirect-path`).value = null;
          // Redirect to account page
          return navigateTo(redirectPath || "/account");
        }
      },
      { immediate: true }
    );
</script>
<template>
  <div>Waiting for login...</div>
</template>
