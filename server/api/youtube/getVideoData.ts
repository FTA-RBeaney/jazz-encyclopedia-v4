import { serverSupabaseClient } from "#supabase/server";

import { extractVideoId } from "../../utils/youtubeCache";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const q = (query.q as string | undefined)?.trim();

  if (!q) {
    throw createError({
      statusCode: 400,
      statusMessage: "Video URL or ID is required",
    });
  }

  try {
    const client = await serverSupabaseClient(event);
    const id = extractVideoId(q) || (/^[A-Za-z0-9_-]{11}$/.test(q) ? q : null);

    let row: any = null;
    if (id) {
      const { data } = await client.from("videos").select("*").ilike("url", `%${id}%`).single();
      row = data;
    } else {
      const { data } = await client.from("videos").select("*").eq("url", q).single();
      row = data;
    }

    if (!row) return null;

    const toISODuration = (start?: number, end?: number) => {
      if (!start || !end || end <= start) return "PT0S";
      const total = Math.max(0, end - start);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = Math.floor(total % 60);
      return `PT${h ? h + "H" : ""}${m ? m + "M" : ""}${s ? s + "S" : ""}` || "PT0S";
    };

    const vid = extractVideoId(row.url || "") || row.id;
    const snippet = {
      title: row.title || "",
      description: row.description || "",
      thumbnails: row.thumbnails || {},
      channelTitle: row.channel_title || "",
      publishedAt: row.created_at,
    };
    const contentDetails = { duration: toISODuration(row.start, row.end) };

    // Return in the shape expected by clients (top-level fields)
    return {
      id: vid,
      snippet,
      contentDetails,
    };
  } catch (error) {
    console.error("Error loading video data:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch video data from Supabase",
    });
  }
});
