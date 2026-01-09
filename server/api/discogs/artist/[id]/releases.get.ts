export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.discogsApiKey; // use private config for security
  console.log("[Discogs] Using API key:", apiKey);
  const artist_id = event.context.params?.id;
  //   const artist_id = "31615";

  const query = getQuery(event);
  const type = (query.type as string) || "album";

  if (!artist_id) return { error: "Artist ID is required" };

  //   const url = `https://api.discogs.com/artists/${artist_id}/releases?type=${type}&token=${apiKey}`;

  const url = `https://api.discogs.com/database/search?artist=${artist_id}&type=release&format=${type}&token=${apiKey}`;

  // For debugging: return the URL only, never the API key
  if (event.req.headers["x-debug-discogs"] === "1") {
    return {
      debug: {
        url,
      },
    };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text().catch(() => "<failed to read body>");
      console.error("Discogs API error:", response.status, response.statusText, text);
      throw new Error(`Failed to fetch artist details: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Discogs fetch error:", error);
    return {
      error: (error as Error).message || "Failed to fetch Discogs releases",
      url,
    };
  }
});
