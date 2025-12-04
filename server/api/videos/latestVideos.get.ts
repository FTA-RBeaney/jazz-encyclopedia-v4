// server/api/videos/latestVideos.get.ts
import { serverSupabaseClient } from "#supabase/server";
import { H3Event } from "h3";

import { extractVideoId } from "../../utils/youtubeCache";

type Video = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  notes?: string;
  start?: number;
  end?: number;
  views?: number;
};

export default defineEventHandler(async (event: H3Event) => {
  try {
    const client = await serverSupabaseClient<{ videos: Video }>(event);

    // 1. Fetch latest videos from Supabase
    const { data: videos, error } = await client
      .from("videos")
      .select(`*, profiles(*)`)
      .order("created_at", { ascending: false })
      .limit(10); // Increased limit to 10 for better UX

    if (error) {
      console.error("Error fetching latest videos from Supabase:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch latest videos",
      });
    }

    if (!videos || videos.length === 0) {
      setResponseStatus(event, 204);
      return [];
    }

    // 2. Build response using only Supabase-stored fields
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
        notes: v.notes,
        start: v.start,
        end: v.end,
        views: v.views,
        tags: v.tags,
      };
    });

    // Set cache headers (5 minutes cache, 10 minutes stale-while-revalidate)
    setHeader(event, "Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    return result;
  } catch (error: unknown) {
    console.error("Error in latest videos endpoint:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to process latest videos",
      data: { error: errorMessage },
    });
  }
});
