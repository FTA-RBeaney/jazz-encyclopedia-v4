<script setup>
  defineProps({ image: { type: String } });

  const open = ref(false);
</script>

<template>
  <section class="page-hero relative flex h-screen w-full items-center justify-center bg-black">
    <div class="fader h-full w-full">
      <div v-if="image" class="h-full">
        <img :src="image" :alt="title" class="absolute inset-0 h-full w-full object-cover" />
      </div>
      <ClientOnly v-else>
        <video loop muted autoplay playsinline class="background-video h-full">
          <source
            src="https://res.cloudinary.com/dgbn0ttzf/video/upload/v1731419446/Lindy_Clips_BG_ruarys.mp4"
            type="video/mp4"
          />
        </video>
      </ClientOnly>
    </div>
    <div class="absolute z-20 mx-auto max-w-screen-xl px-4 py-28 md:px-8">
      <div class="mx-auto max-w-6xl space-y-5 text-center">
        <h1 class="mx-auto text-4xl font-extrabold text-white md:text-8xl">
          Welcome to the Swingcyclopedia
        </h1>
        <!-- <p class="max-w-2xl mx-auto text-gray-400">
              Sed ut perspiciatis unde omnis iste natus voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae.
            </p> -->
        <!-- <form
              @submit.prevent
              class="justify-center items-center gap-x-3 sm:flex">
              <input
                type="text"
                placeholder="Enter your email"
                class="w-full px-3 py-2.5 text-gray-400 bg-gray-700 focus:bg-gray-900 duration-150 outline-none rounded-lg shadow sm:max-w-sm sm:w-auto" />
              <button
                class="flex items-center justify-center gap-x-2 py-2.5 px-4 mt-3 w-full text-sm text-white font-medium bg-sky-500 hover:bg-sky-400 active:bg-sky-600 duration-150 rounded-lg sm:mt-0 sm:w-auto">
                Get started–
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5">
                  <path
                    fill-rule="evenodd"
                    d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </form> -->
        <!-- <div class="flex items-center justify-center gap-x-4 text-sm text-gray-400">
          <div class="flex">
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 20 20"
            >
              <path
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              />
            </svg>
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 20 20"
            >
              <path
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753 .381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              />
            </svg>
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 20 20"
            >
              <path
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753 .381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              />
            </svg>
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 20 20"
            >
              <path
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753 .381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              />
            </svg>
          </div>
          <p class="text-white"><span>5.0</span> by over 200 users</p>
        </div> -->
      </div>
    </div>
    <div
      class="absolute inset-0 m-auto h-[357px] max-w-xs blur-[118px] sm:max-w-md md:max-w-lg"
      style="
        background: linear-gradient(
          106.89deg,
          rgba(192, 132, 252, 0.11) 15.73%,
          rgba(14, 165, 233, 0.41) 15.74%,
          rgba(232, 121, 249, 0.26) 56.49%,
          rgba(79, 70, 229, 0.4) 115.91%
        );
      "
    ></div>
  </section>
</template>

<style scoped>
  .background-video {
    /* position: absolute;
    top: -50%;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 1;
    width: 100%; */
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .page-hero {
    position: relative;
    overflow: hidden;
  }

  .background-video-content {
    position: relative;
    z-index: 1;
  }

  video[poster] {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .fader {
    background: black;
    --mask-visible: rgba(0, 0, 0, 1);
    --mask-ease: rgba(0, 0, 0, 0.6);
    --mask-invisible: rgba(0, 0, 0, 0.2);
    --mask-off: transparent;
    --horizontal-size: 20%;
    --vertical-size: 100%;
    --mask-bottom: linear-gradient(
      to bottom,
      var(--mask-visible) calc(100% - var(--vertical-size)),
      var(--mask-ease) calc(100% - (var(--vertical-size) / 4)),
      var(--mask-invisible) 100%
    );
    --mask-right: linear-gradient(
      to right,
      var(--mask-invisible),
      var(--mask-visible) var(--horizontal-size),
      var(--mask-visible) calc(100% - var(--horizontal-size)),
      var(--mask-invisible) 100%
    );
    contain: strict;
    isolation: isolate;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    position: absolute;
    inset: 0;
    /* max-width: 1600px; */
    margin-inline: auto;

    -webkit-mask-image: var(--mask-bottom);
    mask-image: var(--mask-bottom);
    -webkit-mask-composite: source-in;
    mask-composite: intersect;
    opacity: 1;
    will-change: transform;

    height: 100vh;
  }
</style>
