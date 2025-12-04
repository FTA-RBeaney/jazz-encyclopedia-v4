<script setup lang="ts">
  import BadgeOne from "~/assets/icons/Rank emblems1.png";
  import BadgeTwo from "~/assets/icons/Rank emblems2.png";
  import BadgeThree from "~/assets/icons/Rank emblems3.png";

  const props = defineProps<{
    stats: {
      numberOfFavourites: number;
      numberOfVideos: number;
      xp: {
        total: number;
        fromFavourites: number;
        fromVideos: number;
      };
      level: {
        current: number;
        progressPct: number; // 0-100
        xpToNextLevel: number | null;
        nextLevelXP: number | null;
        totalXP: number;
      };
    };
    avatar: string;
  }>();

  const progressLabel = computed(() => {
    return `${props.stats.level.progressPct}%`;
  });

  const xpToNextLevelLabel = computed(() => {
    if (props.stats.level.xpToNextLevel === null) {
      return "Max level reached";
    }
    return `${props.stats.level.xpToNextLevel} XP to next level`;
  });

  const levelBadge = computed(() => {
    if (props.stats.level.current === 1) {
      return BadgeOne;
    }
    if (props.stats.level.current === 2) {
      return BadgeTwo;
    }
    return BadgeThree;
  });
</script>

<template>
  <section class="max-w-3xl rounded-md border border-gray-200 bg-white shadow-sm">
    <!-- Card header -->
    <div class="border-b border-gray-200 px-6 py-4">
      <h2 class="text-sm font-medium text-gray-900">Stats</h2>
      <p class="text-xs text-gray-500">Your activity, XP, and level progression.</p>
    </div>

    <!-- Card body -->
    <div class="flex flex-col gap-6 px-6 py-4">
      <!-- Top row: avatar-ish badge + level + next level info -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <!-- Left side: Level badge + XP total -->
        <div class="flex items-start gap-4">
          <!-- Level badge -->
          <div
            class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100 text-xl font-semibold text-gray-900"
          >
            <img :src="avatar" class="h-full w-full object-cover" />
          </div>

          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] leading-none font-medium text-purple-700"
              >
                Level {{ stats.level.current }}
              </span>

              <span class="text-[10px] leading-none tracking-wide text-gray-400 uppercase">
                Profile rank
              </span>
            </div>

            <p class="mt-2 text-xs text-gray-500">
              Total XP:
              <span class="font-medium text-gray-900">
                {{ stats.xp.total }}
              </span>
            </p>
          </div>
        </div>

        <!-- Right side: "next level" summary -->
        <div
          class="flex w-full items-center gap-4 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:w-auto"
        >
          <div>
            <p class="leading-none text-gray-500">Next level</p>

            <p class="mt-1 leading-tight font-medium text-gray-900">
              <span v-if="stats.level.xpToNextLevel !== null">
                {{ xpToNextLevelLabel }}
              </span>
              <span v-else>Max level reached</span>
            </p>

            <p
              v-if="stats.level.nextLevelXP !== null"
              class="mt-1 text-[10px] leading-none text-gray-400"
            >
              Unlocks at {{ stats.level.nextLevelXP }} XP
            </p>
          </div>
          <img :src="levelBadge" class="h-10 w-10" />
          <!-- <Icon name="icons:Rank emblems1.png" class="h-10 w-10 fill-red-600 stroke-red-600 text-red-600" /> -->
        </div>
      </div>

      <!-- Progress bar -->
      <div class="w-full">
        <div class="mb-2 flex justify-between text-[11px] leading-none">
          <span class="font-medium text-gray-600">Level progress</span>
          <span class="font-mono text-gray-500">{{ progressLabel }}</span>
        </div>

        <div class="h-2 w-full overflow-hidden rounded-full border border-gray-200 bg-gray-100">
          <div class="h-full bg-purple-500" :style="{ width: stats.level.progressPct + '%' }" />
        </div>
      </div>

      <!-- “Table” style rows (to match the Settings panel rows in your screenshot) -->
      <div class="overflow-hidden rounded-md border border-gray-200 text-sm">
        <!-- Current level -->
        <div
          class="flex flex-col justify-between border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center"
        >
          <dt class="text-xs font-normal text-gray-500">Current level</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 sm:mt-0">
            Level {{ stats.level.current }}
          </dd>
        </div>

        <!-- Total XP -->
        <div
          class="flex flex-col justify-between border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center"
        >
          <dt class="text-xs font-normal text-gray-500">Total XP</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 sm:mt-0">{{ stats.xp.total }} XP</dd>
        </div>

        <!-- Videos Posted -->
        <div
          class="flex flex-col justify-between border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center"
        >
          <dt class="text-xs font-normal text-gray-500">Videos posted</dt>
          <dd class="mt-1 flex flex-col text-right sm:mt-0 sm:block sm:text-left">
            <span class="text-sm font-medium text-gray-900">
              {{ stats.numberOfVideos }} videos
            </span>
            <span class="text-[11px] leading-tight text-gray-500">
              +{{ stats.xp.fromVideos }} XP
            </span>
          </dd>
        </div>

        <!-- Favourites Added -->
        <div
          class="flex flex-col justify-between border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center"
        >
          <dt class="text-xs font-normal text-gray-500">Favourites added</dt>
          <dd class="mt-1 flex flex-col text-right sm:mt-0 sm:block sm:text-left">
            <span class="text-sm font-medium text-gray-900">
              {{ stats.numberOfFavourites }} favourites
            </span>
            <span class="text-[11px] leading-tight text-gray-500">
              +{{ stats.xp.fromFavourites }} XP
            </span>
          </dd>
        </div>

        <!-- XP to next level -->
        <div class="flex flex-col justify-between px-4 py-3 sm:flex-row sm:items-center">
          <dt class="text-xs font-normal text-gray-500">XP to next level</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 sm:mt-0">
            <template v-if="stats.level.xpToNextLevel !== null">
              {{ stats.level.xpToNextLevel }} XP remaining
            </template>
            <template v-else> You’re at the cap </template>
          </dd>
        </div>
      </div>

      <!-- tiny footer helper text -->
      <p class="text-[11px] leading-snug text-gray-400">
        Gain XP by posting new videos and adding favourites.
      </p>
    </div>
  </section>
</template>
