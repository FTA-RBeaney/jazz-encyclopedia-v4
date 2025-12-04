<script setup>
  import desertIslandJams from "./assets/images/podcasts/desert-island-jams.png";
  import integratedRhythm from "./assets/images/podcasts/integrated-rhythm.png";
  import rhythmAndBooze from "./assets/images/podcasts/rhythm-and-booze.jpg";
  import swingStuff from "./assets/images/podcasts/swing-stuff.png";
  import theTrack from "./assets/images/podcasts/the-track.png";
  import whatAJazz from "./assets/images/podcasts/what-a-jazz.jpg";

  definePageMeta({ layout: "admin" });

  const podcasts = [
    {
      title: "Desert Island Jams",
      description: "A collection of songs that would make up a person's desert island playlist.",
      image: desertIslandJams,
      link: "https://open.spotify.com/show/1ngQC55zrC9mLi3TV1P8UR",
    },
    {
      title: "The Track",
      description: "A podcast about music and culture.",
      image: theTrack,
      link: "https://open.spotify.com/show/30i00crwffIZFb3FiRBSFd?si=a03fb14ebed2442f&nd=1&dlsi=f1f8c3d924894a48",
    },
    {
      title: "What A Jazz",
      description: "A podcast about jazz music and culture.",
      image: whatAJazz,
      link: "https://open.spotify.com/show/6J98EG1uGLZyscNWDaBAIk?si=bb767f8b3f154dbc&nd=1&dlsi=4207722c281f4950",
    },
    {
      title: "Swing Stuff",
      description: "A podcast about swing music and culture.",
      image: swingStuff,
      link: "https://open.spotify.com/show/2hxsJ0YLFizI8LBrDcY9kK?si=792cc48eb5e94fde&nd=1&dlsi=f0a1c13d22304186",
    },
    {
      title: "Integrated Rhythm",
      description: "A podcast about integrated rhythm and culture.",
      image: integratedRhythm,
      link: "https://open.spotify.com/show/30i00crwffIZFb3FiRBSFd?si=a03fb14ebed2442f&nd=1&dlsi=f1f8c3d924894a48",
    },
    {
      title: "Rhythm and Booze",
      description: "A podcast about rhythm and culture.",
      image: rhythmAndBooze,
      link: "https://www.youtube.com/watch?v=QaPaq8HEPDE&list=PLrG0KgXpEVz7d82hyVfGISUqUzBEIIS-V",
    },
  ];
</script>

<template>
  <UiContainer v-if="isLoading" class="my-6 max-w-full gap-4 lg:flex">
    <Loader />
  </UiContainer>

  <UiContainer v-else class="h-full max-w-full">
    <div class="m-6">
      <UiCard class="resize">
        <UiCardContent>
          <CardHeader title="Podcasts" description="A list of swing-focused podcasts" />
          <UiSeparator class="my-4" />
          <ul class="mt-12 grid grid-cols-12 gap-4 pb-4">
            <li
              v-for="(podcast, index) in podcasts"
              :key="index"
              class="col-span-3 flex lg:col-span-3"
            >
              <div
                class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <NuxtLink :to="podcast.link" class="relative">
                  <img
                    class="card-image aspect-square w-full object-cover transition-all duration-300 group-hover:scale-105"
                    :src="podcast.image"
                    format="webp"
                    width="300"
                    height="300"
                    preload
                    loading="lazy"
                    placeholder="https://res.cloudinary.com/dgbn0ttzf/image/upload/v1721434977/person-placeholder_ztoak6.png"
                    @error="
                      $event.target.src =
                        'https://archive.org/download/placeholder-image/placeholder-image.jpg'
                    "
                    alt=""
                  />
                  <div
                    class="absolute top-0 left-0 z-10 h-full w-full bg-gradient-to-t from-black opacity-60"
                  ></div>
                  <div class="absolute bottom-4 left-0 z-20 flex h-10 w-full items-end pl-4">
                    <a href="#">
                      <h5
                        v-if="podcast.title"
                        class="text-md font-bold tracking-tight text-white dark:text-white"
                      >
                        {{ podcast.title }}
                      </h5>
                    </a>
                  </div>
                  <div v-if="supabaseUser" class="absolute top-4 right-4 z-20 ml-4 h-5">
                    <!-- <FavouriteButton
                v-if="isFavourite"
                @click="removeFavourite(artistId)"
                extraClasses="!text-[#EF4444] hover:bg-[#EF4444]/90 focus:ring-[#EF4444]/50"
                ><IconsHeartFull
              /></FavouriteButton>
              <FavouriteButton v-else @click="addFavourite(artistId)"
                ><IconsHeartOutline class="stroke-white"
              /></FavouriteButton> -->
                  </div>
                </NuxtLink>
              </div>
            </li>
          </ul>
        </UiCardContent>
      </UiCard>
    </div>
  </UiContainer>
</template>
