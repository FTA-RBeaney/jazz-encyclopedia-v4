import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  // 1. Identify current user
  const user = await serverSupabaseUser(event);
  const client = await serverSupabaseClient(event);

  // 2. Fetch activity counts
  const { count: numberOfFavourites = 0 } = await client
    .from("favourites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.sub);

  const { count: numberOfVideos = 0 } = await client
    .from("videos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.sub);

  // 3. XP rules (tweak these to taste)
  const XP_PER_FAVOURITE = 5;
  const XP_PER_VIDEO = 20;

  const xpFromFavourites = numberOfFavourites * XP_PER_FAVOURITE;
  const xpFromVideos = numberOfVideos * XP_PER_VIDEO;
  const totalXP = xpFromFavourites + xpFromVideos;

  // 4. Level curve
  // You can make this as spicy as you want. For now:
  // Level 1:   0 XP
  // Level 2: 100 XP
  // Level 3: 250 XP
  // Level 4: 500 XP
  // Level 5: 800 XP
  // etc.
  //
  // We'll store thresholds in ascending order.
  const levelThresholds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000];

  function getLevelData(xp: number) {
    // find highest level where xp >= threshold
    let level = 1;

    for (let i = 0; i < levelThresholds.length; i++) {
      if (xp >= levelThresholds[i]) {
        level = i + 1; // levels are 1-based
      } else {
        break;
      }
    }

    // figure out current + next threshold
    const currentLevelXPFloor = levelThresholds[level - 1] ?? 0;
    const nextLevelXPReq = levelThresholds[level] ?? null; // null if maxed

    // XP you've banked inside THIS level
    const xpIntoLevel = xp - currentLevelXPFloor;

    // XP needed to ding the next level
    const xpToNextLevel = nextLevelXPReq === null ? null : nextLevelXPReq - xp;

    // progress % toward next level (0-100)
    const progressPct =
      nextLevelXPReq === null
        ? 100
        : Math.floor((xpIntoLevel / (nextLevelXPReq - currentLevelXPFloor)) * 100);

    return {
      level,
      totalXP: xp,
      nextLevelXP: nextLevelXPReq, // absolute XP needed to reach next level
      xpToNextLevel, // how much more XP needed from now
      progressPct,
    };
  }

  const levelData = getLevelData(totalXP);

  // 5. Shape the response for your profile "Stats" panel
  const stats = {
    // raw activity
    numberOfFavourites,
    numberOfVideos,

    // XP breakdown
    xp: {
      total: totalXP,
      fromFavourites: xpFromFavourites,
      fromVideos: xpFromVideos,
    },

    // level / progression info
    level: {
      current: levelData.level,
      progressPct: levelData.progressPct, // e.g. 42 -> "42%"
      xpToNextLevel: levelData.xpToNextLevel, // null if max level
      nextLevelXP: levelData.nextLevelXP, // null if max level
      totalXP: levelData.totalXP, // convenience duplicate
    },
  };

  return stats;
});
