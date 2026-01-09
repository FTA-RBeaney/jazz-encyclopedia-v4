export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.discogsApiKey;
  const artist_id = event.context.params?.id;

  if (!artist_id) return { error: "Artist ID is required" };

  const url = `https://api.discogs.com/artists/${artist_id}?token=${apiKey}`;

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
