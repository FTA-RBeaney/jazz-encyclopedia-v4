import { trackQuotaUsage } from "./youtubeCache";

export async function fetchVideoDetails(videoId: string): Promise<any | null> {
  const API_KEY = process.env.NUXT_YOUTUBE_API_KEY;
  if (!API_KEY) {
    throw new Error("YouTube API key is not configured");
  }

  try {
    const response = await $fetch<any>("https://www.googleapis.com/youtube/v3/videos", {
      headers: {
        Referer: process.env.URL || "http://localhost:3000",
      },
      params: {
        part: "snippet,contentDetails,statistics",
        id: videoId,
        key: API_KEY,
      },
    });

    if (!response.items || response.items.length === 0) {
      return null;
    }

    // Track usage for this single call (videos.list cost is 1 unit)
    await trackQuotaUsage("youtube:fetchVideoDetails", 1);

    return response.items[0];
  } catch (error: any) {
    if (error.response?.status === 403) {
      const errData = error.data || error.response?._data;
      console.error("YouTube API 403 Error Details:", JSON.stringify(errData, null, 2));

      const reason = errData?.error?.errors?.[0]?.reason || "unknown";
      const message = errData?.error?.message || error.message;

      throw new Error(`YouTube API Error: ${message} (Reason: ${reason})`);
    }
    console.error("Error fetching YouTube video:", error);
    throw error;
  }
}
