<script setup>
  // get the latest videos
  const { data: latestVideos } = useLatestVideos();

  console.log("latestVideos", latestVideos);
</script>

<template>
  <div class="">
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="avatar btn btn-circle btn-ghost">
        <Icon name="lucide:bell" class="h-5 w-5" />
      </label>

      <ul
        tabindex="0"
        class="dropdown-content top-14 right-0 z-40 mt-6 space-y-6 bg-white lg:absolute lg:mt-0 lg:w-80 lg:space-y-0 lg:rounded-md lg:border lg:shadow-md"
      >
        <li class="block border-b text-xs text-gray-600 lg:px-3 lg:py-2">Latest videos:</li>
        <li v-for="video in latestVideos" :key="video.id">
          <NuxtLink
            :to="`/user-video/${video?.video?.id}`"
            class="block text-xs text-gray-600 hover:text-gray-900 lg:p-3 lg:hover:bg-gray-50"
          >
            <div class="flex justify-between gap-4">
              <div class="text-wrap">
                {{ video.snippet.title }}
              </div>
              <img
                :src="
                  video?.youtube?.snippet?.thumbnails?.maxres?.url ||
                  video?.youtube?.snippet?.thumbnails?.high?.url ||
                  video?.snippet?.thumbnails?.medium?.url ||
                  video?.snippet?.thumbnails?.default?.url
                "
                class="aspect-video h-full w-20 rounded-lg object-cover transition-all hover:scale-105"
              />
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- <div class="w-lg fixed left-0 border bg-white">
      <pre>{{ latestVideos }}</pre>
    </div> -->
  </div>
</template>
