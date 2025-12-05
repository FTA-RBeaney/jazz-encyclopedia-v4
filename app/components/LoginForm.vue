<script setup lang="ts">
  const supabase = useSupabaseClient();

  const toast = useToast();

  const providers = [
    {
      label: "Google",
      icon: "i-simple-icons-google",
      onClick: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/confirm`,
          },
        });
        if (error) console.log(error);
        toast.add({ title: "Google", description: "Login with Google" });
      },
    },
  ];

  function onSubmit() {
    console.log("Submitted");
  }
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :providers="providers"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
