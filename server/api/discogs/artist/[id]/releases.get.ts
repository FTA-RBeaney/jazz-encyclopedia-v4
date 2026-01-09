export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.discogsApiKey;
  const artist_id = event.context.params?.id;
  //   const artist_id = "31615";

  const query = getQuery(event);
  const type = (query.type as string) || "album";

  if (!artist_id) return { error: "Artist ID is required" };

  //   const url = `https://api.discogs.com/artists/${artist_id}/releases?type=${type}&token=${apiKey}`;

  const url = `https://api.discogs.com/database/search?artist=${artist_id}&type=release&format=${type}&token=${apiKey}`;

  // For debugging: return the URL and API key value in the response
  if (event.req.headers["x-debug-discogs"] === "1") {
    return { debug: { url, apiKey } };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch artist details");

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message, url, apiKey };
  }
});
