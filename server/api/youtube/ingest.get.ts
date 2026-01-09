// Returns normalized, cached YouTube metadata (one-time fetch for ingestion)
import { H3Event } from "h3";

import { fetchVideoDetails } from "../../utils/youtubeApi";
import { extractVideoId } from "../../utils/youtubeCache";
import { normalizeYouTubeVideo } from "../../utils/youtubeNormalize";

export default defineEventHandler(async (event: H3Event) => {
  // const query = getQuery(event);
  // Manual parsing to avoid "Invalid URL" error in h3 2.x
  const url = new URL(event.node.req.url || "", "http://localhost");
  const query = Object.fromEntries(url.searchParams.entries());
  const q = (query.q as string | undefined)?.trim();

  if (!q) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing query parameter q (YouTube URL or ID)",
    });
  }

  try {
    // Accept either a URL or a bare ID
    const asId = extractVideoId(q) || (/^[A-Za-z0-9_-]{11}$/.test(q) ? q : null);

    if (!asId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid YouTube URL or ID",
      });
    }

    // Fetch directly using the new utility
    const item = await fetchVideoDetails(asId);

    if (!item) {
      return null;
    }

    return normalizeYouTubeVideo(item);
  } catch (error) {
    console.error("[youtube/ingest] Failed:", error);
    throw createError({
      statusCode: (error as any).statusCode || 500,
      statusMessage:
        (error as any).statusMessage ||
        (error as any).message ||
        "Failed to fetch YouTube metadata",
    });
  }
});
