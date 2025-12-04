// server/api/videos/latest.get.ts
import { serverSupabaseClient } from "#supabase/server";
import { H3Event } from "h3";

import { extractVideoId } from "../../utils/youtubeCache";

type TagVideo = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  // add the columns you need
};

export default defineEventHandler(async (event: H3Event) => {
  // Read tag from query string
  const { tag } = getQuery(event) as { tag?: string };
  if (!tag) {
    throw createError({ statusCode: 400, statusMessage: "Missing required query parameter: tag" });
  }
  const normalizedTag = decodeURIComponent(String(tag)).replace(/-/g, " ").trim();
  const client = await serverSupabaseClient<{
    videos: TagVideo;
  }>(event);

  let gatherData: any[] = [];

  // First try normalized (slug → label), then fall back to raw tag if no results
  let { data: videos, error } = await client
    .from("videos")
    .select(`*, profiles(*)`)
    .contains("tags", [normalizedTag])
    .order("views", { ascending: false });

  if (!error && Array.isArray(videos) && videos.length === 0 && normalizedTag !== tag) {
    const fallback = await client
      .from("videos")
      .select(`*, profiles(*)`)
      .contains("tags", [tag])
      .order("views", { ascending: false });
    if (!fallback.error) {
      videos = fallback.data as any[] | null;
    }
  }

  // If still no results, try a case-insensitive substring match for setups
  // where `tags` is stored as a text column or inconsistent casing.
  if (Array.isArray(videos) && videos.length === 0) {
    const alt1 = await client
      .from("videos")
      .select("*, profiles(*)")
      .ilike("tags", `%${normalizedTag}%`)
      .order("views", { ascending: false });
    if (!alt1.error && Array.isArray(alt1.data) && alt1.data.length > 0) {
      videos = alt1.data as any[];
    }
  }

  if (Array.isArray(videos) && videos.length === 0 && normalizedTag !== tag) {
    const alt2 = await client
      .from("videos")
      .select("*, profiles(*)")
      .ilike("tags", `%${tag}%`)
      .order("views", { ascending: false });
    if (!alt2.error && Array.isArray(alt2.data) && alt2.data.length > 0) {
      videos = alt2.data as any[];
    }
  }

  // As a last resort, fetch a limited set and filter in code for arrays
  if (Array.isArray(videos) && videos.length === 0) {
    const probe = await client
      .from("videos")
      .select("*, profiles(*)")
      .not("tags", "is", null)
      .limit(200);
    if (!probe.error && Array.isArray(probe.data)) {
      const norm = (s: string) => String(s).toLowerCase().replace(/\s|-/g, "");
      const needleA = norm(normalizedTag);
      const needleB = norm(String(tag));
      videos = probe.data.filter(
        (v: any) =>
          Array.isArray(v.tags) &&
          v.tags.some((t: string) => {
            const x = norm(t);
            return x === needleA || x === needleB;
          })
      ) as any[];
    }
  }

  if (error) {
    // Log for observability
    console.error("GET /api/videos/tag error:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch latest video" });
  }

  // No rows? 204 is nice semantics; clients can still treat this as "no content".
  if (!videos) {
    setResponseStatus(event, 204);
    return null;
  }

  // Build gatherData with Supabase-only fields
  const toISODuration = (start?: number, end?: number) => {
    if (!start || !end || end <= start) return "PT0S";
    const total = Math.max(0, end - start);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = Math.floor(total % 60);
    return `PT${h ? h + "H" : ""}${m ? m + "M" : ""}${s ? s + "S" : ""}` || "PT0S";
  };

  gatherData = videos.map((v: any) => {
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
      supabase_id: v.id,
      notes: v.notes,
      start: v.start,
      end: v.end,
      tags: v.tags,
    };
  });

  // Reasonable caching; tweak to your needs (esp. if using edge hosting/CDN)
  setHeader(event, "Cache-Control", "s-maxage=15, stale-while-revalidate=60");

  return gatherData;
});
