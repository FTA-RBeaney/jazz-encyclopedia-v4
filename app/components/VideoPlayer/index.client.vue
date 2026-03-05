<script setup>
  import "vidstack/player/styles/default/theme.css";
  import "vidstack/player/styles/default/layouts/video.css";
  import "vidstack/player/styles/default/layouts/audio.css";
  import "vidstack/player";
  import "vidstack/player/layouts/default";
  import "vidstack/player/ui";

  import { ref } from "vue";

  const props = defineProps({
    video: String,
    poster: String,
    start: String,
    end: String,
    tags: Array,
    portrait: Boolean,
    autoplay: Boolean,
    posterImage: String,
    viewType: {
      type: String,
      default: "video",
    },
  });

  const playerRef = ref(null);
  const isReady = ref(false);

  const clipStart = computed(() => (props.start && Number(props.start) > 0) ? Number(props.start) : undefined);
  const clipEnd = computed(() => (props.end && Number(props.end) > 0) ? Number(props.end) : undefined);

  const pendingPlay = ref(false);

  const onCanPlay = () => {
    isReady.value = true;
    if (pendingPlay.value) {
      playerRef.value?.play?.();
      pendingPlay.value = false;
    }
  };

  defineExpose({
    play: () => {
      if (isReady.value) {
        playerRef.value?.play?.();
      } else {
        pendingPlay.value = true;
      }
    },
    pause: () => playerRef.value?.pause?.(),
    currentTime: (time) => {
      if (playerRef.value) playerRef.value.currentTime = time;
    },
  });
</script>

<template>
  <media-player
    :class="[
      portrait ? 'aspect-9/16' : 'aspect-video',
      viewType === 'audio' ? 'max-h-12' : 'max-h-full',
    ]"
    ref="playerRef"
    @can-play="onCanPlay"
    :src="video"
    playsinline
    crossOrigin
    :clipStartTime="clipStart"
    :clipEndTime="clipEnd"
    :autoplay="autoplay"
    load="eager"
    aspectRatio="16/9"
    :viewType="viewType"
  >
    <media-provider>
      <media-poster
        v-if="posterImage && viewType === 'video'"
        :src="posterImage"
        class="vds-poster"
      ></media-poster>
    </media-provider>

    <media-audio-layout></media-audio-layout>
    <media-video-layout></media-video-layout>
  </media-player>
</template>

<style>
  .media-player[data-view-type="video"] {
    aspect-ratio: 16 / 9;
  }

  /* Hide YouTube's native UI (play button, More Videos) before playback starts.
     Vidstack's own poster + controls layer shows instead. */
  media-player:not([data-started]) iframe.vds-youtube {
    visibility: hidden;
  }

  .vds-video-layout {
    --video-brand: hsl(0, 0%, 96%);
    /* Layout: https://vidstack.io/docs/player/components/layouts/default-layout#video-layout  */
    /* Components: https://www.vidstack.io/docs/player/components/layouts/default-layout#components */
  }

  .vds-audio-layout {
    height: auto;
    font-size: 12px;
    --audio-brand: #f5f5f5;
    --audio-controls-color: #f5f5f5;
    --audio-focus-ring-color: rgb(78 156 246);
    --audio-focus-ring: 0 0 0 3px var(--media-focus-ring-color);
    --audio-font-family: sans-serif;
    --media-slider-track-bg: rgb(255 255 255 / 0.6);

    --audio-bg: black;
    --audio-border-radius: 6px;
    --audio-border: 1px solid rgb(255 255 255 / 0.1);

    /* Buttons. */
    --audio-button-size: 30px;

    --audio-play-button-size: 23px;
    --audio-play-button-color: rgb(0 0 0 / 0.8);
    --audio-play-button-bg: var(--media-brand);
    --audio-play-button-border-radius: 100%;
    --audio-caption-button-off-opacity: 0.64;

    /* Sliders. */
    --audio-slider-chapter-title-color: black;
    --audio-slider-value-border: 1px solid rgb(255 255 255 / 0.1);

    --audio-volume-height: auto;
    --audio-volume-bg: var(--media-menu-bg, rgb(10 10 10));
    --audio-volume-border-radius: 8px;

    /* Menus. */
    --audio-menu-max-height: 320px;

    /* Buffering. */
    --audio-buffering-stripe-color: rgb(0 0 0 / 0.25);
    --audio-buffering-stripe-size: 30px;
    --audio-buffering-stripe-speed: 2s;

    /* Time */
    --audio-time-font-size: 13px;
  }

  .plyr {
    --plyr-color-main: hsl(198, 100%, 50%);
    /* CSS Vars: https://vidstack.io/docs/player/components/layouts/plyr-layout#css-variables */
  }
</style>
