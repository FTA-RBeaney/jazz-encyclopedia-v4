export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.discogsApiKey; // use private, not public
  const artist_id = event.context.params?.id;

  if (!artist_id) return { error: "Artist ID is required" };

  const url = `https://api.discogs.com/artists/${artist_id}?token=${apiKey}`;

  // For debugging: return the URL only, never the API key
  if (event.req.headers["x-debug-discogs"] === "1") {
    return { debug: { url } };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch artist details");

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: (error as Error).message, url };
  }
});
