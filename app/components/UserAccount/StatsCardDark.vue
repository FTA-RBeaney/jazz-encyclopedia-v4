<script setup lang="ts">
  // Props type matches the API response we built
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
  }>();

  // Small derived helpers for display
  const progressLabel = computed(() => {
    return `${props.stats.level.progressPct}%`;
  });

  const xpToNextLevelLabel = computed(() => {
    if (props.stats.level.xpToNextLevel === null) {
      return "Max level reached";
    }
    return `${props.stats.level.xpToNextLevel} XP to next level`;
  });
</script>

<template>
  <section
    class="sticky top-4 mx-auto mt-6 flex w-full max-w-lg flex-col gap-6 rounded-lg bg-zinc-900 p-6 text-white shadow-xl ring-1 ring-zinc-800"
  >
    <!-- Header row: avatar-ish circle + level badge + total XP -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-4">
        <!-- Placeholder avatar / emblem -->
        <div
          class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xl font-bold shadow-lg ring-2 ring-white/10"
        >
          {{ stats.level.current }}
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-lg bg-indigo-600/20 px-2 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/30 ring-inset"
            >
              Level {{ stats.level.current }}
            </span>

            <span class="text-[10px] leading-none tracking-wide text-zinc-400 uppercase">
              Profile Rank
            </span>
          </div>

          <p class="mt-1 text-sm text-zinc-300">
            Total XP:
            <span class="font-semibold text-white">{{ stats.xp.total }}</span>
          </p>
        </div>
      </div>

      <!-- Compact "to next level" panel -->
      <div
        class="rounded-lg bg-zinc-800/60 px-3 py-2 text-right text-xs shadow-inner ring-1 ring-white/5"
      >
        <p class="leading-none text-zinc-400">Next Level</p>
        <p class="mt-1 leading-tight font-semibold text-white">
          <span v-if="stats.level.xpToNextLevel !== null">
            {{ xpToNextLevelLabel }}
          </span>
          <span v-else>Maxed 🔥</span>
        </p>
        <p
          v-if="stats.level.nextLevelXP !== null"
          class="mt-1 text-[10px] leading-none text-zinc-500"
        >
          Unlocks at {{ stats.level.nextLevelXP }} XP
        </p>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-xs leading-none">
        <span class="font-medium text-zinc-300">Level Progress</span>
        <span class="font-mono text-zinc-400">{{ progressLabel }}</span>
      </div>

      <div
        class="h-3 w-full overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/10 ring-inset"
      >
        <div
          class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
          :style="{ width: stats.level.progressPct + '%' }"
        />
      </div>
    </div>

    <!-- XP breakdown cards -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Videos card -->
      <div
        class="flex flex-col gap-2 rounded-xl bg-zinc-800/60 p-4 shadow-inner ring-1 ring-white/5"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
            Videos Posted
          </span>
          <span
            class="rounded-md bg-zinc-900/80 px-2 py-0.5 font-mono text-[10px] text-zinc-300 ring-1 ring-white/10"
          >
            +{{ stats.xp.fromVideos }} XP
          </span>
        </div>

        <div class="flex items-baseline gap-2">
          <span class="text-2xl leading-none font-semibold text-white">{{
            stats.numberOfVideos
          }}</span>
          <span class="text-[11px] leading-none text-zinc-500">total</span>
        </div>

        <p class="text-[11px] leading-snug text-zinc-500">
          Uploading videos is high-value. Keep posting to level fast.
        </p>
      </div>

      <!-- Favourites card -->
      <div
        class="flex flex-col gap-2 rounded-xl bg-zinc-800/60 p-4 shadow-inner ring-1 ring-white/5"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
            Favourites Added
          </span>
          <span
            class="rounded-md bg-zinc-900/80 px-2 py-0.5 font-mono text-[10px] text-zinc-300 ring-1 ring-white/10"
          >
            +{{ stats.xp.fromFavourites }} XP
          </span>
        </div>

        <div class="flex items-baseline gap-2">
          <span class="text-2xl leading-none font-semibold text-white">{{
            stats.numberOfFavourites
          }}</span>
          <span class="text-[11px] leading-none text-zinc-500">total</span>
        </div>

        <p class="text-[11px] leading-snug text-zinc-500">
          Bookmark stuff you like, get XP for it. Easy win.
        </p>
      </div>
    </div>

    <!-- Footer strip / flavour -->
    <div
      class="flex items-center justify-between rounded-lg bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 ring-1 ring-white/5"
    >
      <div class="text-xs leading-snug text-zinc-300">
        <p class="font-medium text-white">You're Level {{ stats.level.current }}</p>
        <p v-if="stats.level.xpToNextLevel !== null" class="text-[11px] text-zinc-400">
          Earn {{ stats.level.xpToNextLevel }} more XP to level up.
        </p>
        <p v-else class="text-[11px] text-zinc-400">You’ve reached the current cap. Respect. 🧙‍♂️</p>
      </div>

      <div class="text-right text-[10px] leading-tight">
        <p class="tracking-wide text-zinc-400 uppercase">Total XP</p>
        <p class="text-sm font-semibold text-white">
          {{ stats.xp.total }}
        </p>
      </div>
    </div>
  </section>
</template>
