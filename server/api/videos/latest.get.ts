// server/api/videos/latest.get.ts
import { serverSupabaseClient } from "#supabase/server";
import { H3Event } from "h3";

type Video = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  // add the columns you need
};

export default defineEventHandler(async (event: H3Event) => {
  const supabase = await serverSupabaseClient<{
    videos: Video;
  }>(event);

  const { data, error } = await supabase
    .from("videos")
    .select(`*,profiles(*)`)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // Log for observability
    console.error("GET /api/videos/latest error:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch latest video" });
  }

  // No rows? 204 is nice semantics; clients can still treat this as "no content".
  if (!data) {
    setResponseStatus(event, 204);
    return null;
  }

  // Reasonable caching; tweak to your needs (esp. if using edge hosting/CDN)
  setHeader(event, "Cache-Control", "s-maxage=15, stale-while-revalidate=60");

  return data satisfies Video;
});
