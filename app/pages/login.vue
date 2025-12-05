<script setup>
  import { Auth } from "@supa-kit/auth-ui-vue";
  import { ThemeSupa } from "@supabase/auth-ui-shared";





  // definePageMeta({
    //   layout: "login",
    // });

    const supabaseClient = useSupabaseClient();

    const backgrounds = [
      "http://www.rikomatic.com/wp-content/uploads/import/6a00d8341c77b053ef01bb08ad4ee9970d.jpg",
      "http://www.rikomatic.com/wp-content/uploads/import/6a00d8341c77b053ef01b7c808a74f970b.jpg",
      "https://media.gettyimages.com/id/1423946615/photo/the-lindy-hop.jpg?s=1024x1024&w=gi&k=20&c=gxsTzfTYweK9VMbRPJoCg6JQmN4DVvSVerXGh7vJrxc=",
      "https://i.ytimg.com/vi/-19HZZcMKX0/maxresdefault.jpg",
      "https://i0.wp.com/blog.straycat.me.uk/wp-content/uploads/2024/02/Hellzapoppin-New-YT-Cover-2.png?fit=1116%2C714&ssl=1",
    ];

    const bgImage = ref();

    function changeBg() {
      const randIndex = Math.floor(Math.random() * backgrounds.length);
      bgImage.value = backgrounds[randIndex];
    }
    changeBg();
</script>

<template>
  <div class="h-screen">
    <div class="mb-8 md:hidden">
      <img alt="Authentication" width="1280" height="1214" class="block" :src="bgImage" />
    </div>

    <div
      class="relative container h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
      <div
        class="bg-muted relative hidden h-full flex-col bg-cover bg-center bg-no-repeat p-10 text-white lg:flex dark:border-r"
        :style="`background-image: url('${bgImage}')`"
      >
        <div class="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Dance Encyclopedia
        </div>
      </div>
      <div class="lg:p-8">
        <div
          class="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[350px]"
        >
          <div class="flex flex-col space-y-2 text-center">
            <h1 class="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p class="text-muted-foreground text-sm">
              Register/Sign in below with your Google account
            </p>
          </div>
          <Auth
            :supabaseClient="supabaseClient"
            :appearance="{
              theme: ThemeSupa,
            }"
            :providers="['google']"
            onlyThirdPartyProviders
            redirectTo="/confirm"
          />
          <p class="text-center">
            PLEASE NOTE: This site is currently DESKTOP ONLY. If you're viewing this on mobile, then
            don't 🙂
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  body {
    margin: 0;
  }
</style>
