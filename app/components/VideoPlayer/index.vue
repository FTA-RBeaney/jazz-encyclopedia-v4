<script setup>
  import "vidstack/player/styles/default/theme.css";
  import "vidstack/player/styles/default/layouts/video.css";
  import "vidstack/player";
  import "vidstack/player/layouts/default";
  import "vidstack/player/ui";

  const props = defineProps({
    video: String,
    poster: String,
    start: String,
    end: String,
    tags: Array,
    portrait: Boolean,
    autoplay: Boolean,
  });
</script>

<template>
  <div>
    <ClientOnly>
      <media-player
        :src="video"
        playsinline
        crossOrigin
        viewType="video"
        :clipStartTime="start"
        :clipEndTime="end"
        :class="portrait ? 'aspect-[9/16]' : 'aspect-[16/9]'"
        :autoplay="autoplay"
        load="visible"
        aspectRatio="16/9"
      >
        <media-provider>
          <!-- <media-poster class="vds-poster"></media-poster> -->
        </media-provider>
        <media-video-layout></media-video-layout>
        <media-controls>
          <media-controls-group></media-controls-group>
          <media-controls-group></media-controls-group>
          <media-controls-group></media-controls-group>
        </media-controls>
      </media-player>
    </ClientOnly>
  </div>
</template>

<style>
  iframe.vds-youtube[data-no-controls] {
    height: 100% !important;
  }

  [data-media-player][data-layout="video"]:not([data-fullscreen]) {
    /* @apply overflow-hidden bg-transparent py-0 shadow-xl; */
  }

  .media-player[data-view-type="video"] {
    aspect-ratio: 16 / 9;
  }

  .vds-video-layout {
    --video-brand: hsl(0, 0%, 96%);
    /* Layout: https://vidstack.io/docs/player/components/layouts/default-layout#video-layout  */
    /* Components: https://www.vidstack.io/docs/player/components/layouts/default-layout#components */
  }

  .vds-audio-layout {
    --audio-brand: hsl(0, 0%, 96%);
    /* Layout: https://vidstack.io/docs/player/components/layouts/default-layout#audio-layout */
    /* Components: https://www.vidstack.io/docs/player/components/layouts/default-layout#components */
  }
  [data-media-player][data-layout="video"]:not([data-fullscreen]) {
    border: none;
  }

  .plyr {
    --plyr-color-main: hsl(198, 100%, 50%);
    /* CSS Vars: https://vidstack.io/docs/player/components/layouts/plyr-layout#css-variables */
  }

  [data-media-player][data-layout="video"]:not([data-fullscreen]) {
    box-shadow: none;
  }
</style>
