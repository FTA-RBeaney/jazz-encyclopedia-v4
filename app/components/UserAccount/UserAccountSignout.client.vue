<script setup>
  const supabase = useSupabaseClient();
  const accountStore = useAuthStore();

  onMounted(async () => {
    // await accountStore.init();
  });

  async function signout() {
    await supabase.auth.signOut();
    if (accountStore) {
      accountStore.signout();
    }
    navigateTo("/", { replace: true });
  }
</script>
<template>
  <a
    href="#"
    @click.prevent="signout()"
    class="block w-full border-t py-3 text-justify text-gray-600 hover:text-gray-900 lg:p-3 lg:hover:bg-gray-50"
    >Signout</a
  >
</template>
