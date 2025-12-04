<script setup>
  const props = defineProps({
    video: {
      type: Object,
      default: () => ({}),
    },
    tagsVisible: {
      type: Boolean,
      default: false,
    },
    userVisible: {
      type: Boolean,
      default: false,
    },
  });

  const lengthInSeconds = (start, end) => {
    if (start && end) {
      return `${end - start} seconds`;
    } else {
      return "Full video";
    }
  };

  const videoProfiles = computed(() => {
    return props?.video?.video?.profiles || props?.video?.profiles;
  });
</script>
<template>
  <div class="group relative mb-2">
    <NuxtLink :to="`/user-video/${video.supabase_id}`">
      <div class="relative aspect-video overflow-hidden rounded-lg">
        <div
          class="absolute top-0 left-0 z-10 h-full w-full bg-black/50 opacity-0 transition-all group-hover:opacity-100"
        >
          <Icon
            name="lucide:circle-play"
            size="30"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
          />
        </div>
        <img
          :src="
            video?.youtube?.snippet?.thumbnails?.maxres?.url ||
            video?.youtube?.snippet?.thumbnails?.high?.url ||
            video?.snippet?.thumbnails?.medium?.url ||
            video?.snippet?.thumbnails?.default?.url
          "
          class="h-full w-full object-cover transition-all hover:scale-105"
        />
        <div class="absolute right-2 bottom-2 flex space-x-2">
          <UiBadge v-if="video?.views" class="rounded-sm">{{ video?.views }} views</UiBadge>
          <UiBadge class="rounded-sm" variant="secondary">
            <Icon name="lucide:clock" size="10" class="mr-2" />
            {{ lengthInSeconds(video.start, video.end) }}
          </UiBadge>
        </div>
      </div>
    </NuxtLink>

    <div class="mt-3">
      <NuxtLink :to="`/user-video/${video.supabase_id}`">
        <h3 class="max-w-full text-xs font-semibold">
          <span v-if="video?.youtube?.snippet">
            {{ video?.youtube?.snippet?.title?.substring(0, 50) + "…" }}
          </span>
          <span v-else>
            {{ video?.snippet?.title }}
          </span>
        </h3>
      </NuxtLink>

      <div v-html="video.notes" class="my-1 text-xs"></div>

      <div v-if="videoProfiles.first_name && userVisible" class="mt-2 flex items-center gap-2">
        <UiAvatar v-if="videoProfiles" class="flex size-6 items-center gap-2">
          <UiAvatarImage :src="videoProfiles.avatar_url" />
          <UiAvatarFallback
            ><img
              src="https://api.dicebear.com/7.x/lorelei/svg?flip=false"
              alt="John Doe"
              class="aspect-square h-full w-full object-cover"
          /></UiAvatarFallback>
        </UiAvatar>

        <NuxtLink
          :to="`/user-videos/${videoProfiles.id}`"
          class="text-[10px] leading-0 font-semibold"
        >
          {{ videoProfiles.first_name }} {{ videoProfiles.last_name }}
        </NuxtLink>
        <!-- <p class="text-sm text-muted-foreground"></p> -->
      </div>

      <p class="text-muted-foreground mt-1 text-xs font-medium">
        {{ video?.youtube?.snippet?.channelTitle || video?.snippet?.channelTitle }}
      </p>

      <div v-if="tagsVisible">
        <NuxtLink v-for="(tag, i) in video.tags" :key="`tag${i}`" :to="`/videos/${tag}`">
          <UiBadge class="mt-2 mr-1 rounded text-[10px]">
            {{ tag }}
          </UiBadge>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
