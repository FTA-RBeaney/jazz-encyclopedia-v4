<script setup lang="ts">
  const props = defineProps<{ artistId: string }>();
  const chosenOption = ref("album");
  const discogsData = ref({});

  const {
    data,
    error,
    pending: discogsPending,
  } = await useAsyncData("discogs-releases" + props.artistId, async () => {
    return await $fetch(`/api/discogs/artist/${props.artistId}/releases`, {
      query: { type: chosenOption.value },
    }).then((data) => {
      discogsData.value = data;
      return data;
    });
  });

  const options = [
    { title: "Album", key: "album" },
    { title: "EP", key: "ep" },
  ];

  const changeQueryType = async (newType: string) => {
    chosenOption.value = newType;
    await $fetch(`/api/discogs/artist/${props.artistId}/releases`, {
      query: { type: chosenOption.value },
    }).then((data) => {
      discogsData.value = data;
    });
  };

  const trimTitle = (title: string) => {
    // get rid of the artist name and the - and limit the title to 200 cahracters
    const parts = title.split(" - ");
    if (parts.length > 1) {
      parts.shift();
      title = parts.join(" - ");
    }
    if (title.length > 50) {
      title = title.substring(0, 50) + "...";
    }
    return title;
  };

  // take an array and display the first item, whilst also adding a "+n more" if there are more than one
  const formatArrayWithMore = (arr: string[]) => {
    if (arr.length === 0) return "";
    if (arr.length === 1) return "";
    return `+${arr.length - 1} more`;
  };
</script>

<template>
  <div v-if="discogsPending" class="flex items-center justify-center p-4">Loading...</div>
  <div v-else>
    <div class="flex gap-2">
      <UiButton
        @click="changeQueryType(option.key)"
        v-for="option in options"
        :key="option.key"
        :variant="chosenOption === option.key ? 'default' : 'outline'"
      >
        {{ option.title }}
      </UiButton>
    </div>
    <UiTable>
      <UiTableHeader>
        <UiTableRow>
          <UiTableHead>Title</UiTableHead>
          <UiTableHead>Year</UiTableHead>
          <UiTableHead>Format</UiTableHead>
          <UiTableHead>Label</UiTableHead>
          <UiTableHead></UiTableHead>
        </UiTableRow>
      </UiTableHeader>
      <UiTableBody>
        <UiTableRow
          v-for="release in discogsData.results || discogsData.releases"
          :key="release.id"
        >
          <UiTableCell>
            <NuxtLink :to="`/albums/${release.id}`" class="flex items-center gap-2">
              <NuxtImg
                :src="release.thumb || 'https://iili.io/HlHy9Yx.png'"
                alt="Release Cover"
                class="aspect-square w-12 rounded-lg object-cover"
              />
              {{ trimTitle(release.title) }}
            </NuxtLink>
          </UiTableCell>
          <UiTableCell>{{ release.year }}</UiTableCell>
          <UiTableCell>
            <div class="grid gap-1">
              <UiBadge>{{ release.format[0] }}</UiBadge
              >{{ formatArrayWithMore(release.format) }}
            </div>
          </UiTableCell>
          <UiTableCell>
            <div class="grid gap-1">
              <UiBadge>{{ release.label[0] }}</UiBadge>
              {{ formatArrayWithMore(release.label) }}
            </div>
          </UiTableCell>
          <UiTableCell>
            <AlbumSheet :album-id="release.id" />
          </UiTableCell>
        </UiTableRow>
      </UiTableBody>
    </UiTable>
    <div class="grid grid-cols-8 gap-2">
      <div v-for="release in discogsData.results" :key="release.id" class="space-y-2">
        <NuxtImg
          :src="release.thumb || 'https://iili.io/HlHy9Yx.png'"
          alt="Release Cover"
          class="aspect-square w-full rounded-lg object-cover"
        />
        <p class="text-xs">{{ release.title }}</p>
      </div>
    </div>
  </div>
</template>
