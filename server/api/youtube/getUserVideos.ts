import { serverSupabaseClient } from "#supabase/server";

import { extractVideoId } from "../../utils/youtubeCache";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const client = await serverSupabaseClient(event);
  const userId = query.q;

  try {
    // 1. Fetch videos from Supabase
    let supabaseQuery = client.from("videos").select(`*, profiles(*)`);
    if (userId) {
      supabaseQuery = supabaseQuery.eq("user_id", userId);
    }

    const { data: videos, error } = await supabaseQuery;
    if (error) throw error;
    if (!videos || videos.length === 0) return [];

    // 2. Build response strictly from Supabase
    const toISODuration = (start?: number, end?: number) => {
      if (!start || !end || end <= start) return "PT0S";
      const total = Math.max(0, end - start);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = Math.floor(total % 60);
      return `PT${h ? h + "H" : ""}${m ? m + "M" : ""}${s ? s + "S" : ""}` || "PT0S";
    };

    const result = videos.map((v: any) => {
      const vid = extractVideoId(v.url || "") || v.id;
      const snippet = {
        title: v.title || "",
        description: v.description || "",
        thumbnails: v.thumbnails || {},
        channelTitle: v.channel_title || "",
        publishedAt: v.created_at,
      };
      const contentDetails = { duration: toISODuration(v.start, v.end) };

      return {
        id: vid,
        snippet,
        contentDetails,
        youtube: { id: vid, snippet, contentDetails },
        video: v,
        profile: v.profiles,
        supabase_id: v.id,
        tags: v.tags,
        notes: v.notes,
        start: v.start,
        end: v.end,
      };
    });

    return result;
  } catch (error: unknown) {
    console.error("Error in getUserVideos:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw createError({
      statusCode: 500,
      message: "Failed to fetch user videos",
      data: { error: errorMessage },
    });
  }
});
