// server/api/videos/optimized-popular.get.ts
import { serverSupabaseClient } from "#supabase/server";
import { H3Event } from "h3";

import { extractVideoId } from "../../utils/youtubeCache";

// Define types for better type safety
type Video = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  views?: number;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
};

export default defineEventHandler(async (event: H3Event) => {
  try {
    const client = await serverSupabaseClient<{ videos: Video }>(event);

    // Get popular videos from Supabase
    const { data: videos, error } = (await client
      .from("videos")
      .select("*, profiles(*)")
      .not("views", "is", null)
      .order("views", { ascending: false })
      .limit(10)) as { data: Video[] | null; error: any };

    if (error) {
      console.error("Error fetching videos from Supabase:", error);
      return [];
    }

    if (!videos || videos.length === 0) {
      return [];
    }

    const toISODuration = (start?: number, end?: number) => {
      if (!start || !end || end <= start) return "PT0S";
      const total = Math.max(0, end - start);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = Math.floor(total % 60);
      return `PT${h ? h + "H" : ""}${m ? m + "M" : ""}${s ? s + "S" : ""}` || "PT0S";
    };

    const results = videos.map((v: any) => {
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
        notes: v.notes,
        start: v.start,
        end: v.end,
        views: v.views,
        tags: v.tags,
      };
    });

    return results;
  } catch (error) {
    console.error("Error in popular videos endpoint:", error);
    return [];
  }
});
