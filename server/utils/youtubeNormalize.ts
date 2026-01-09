// Utility to normalize YouTube API video item into a compact shape

type YtItem = any;

function parseISODurationToSeconds(iso: string | undefined): number {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const h = Number(m[1] || 0);
  const min = Number(m[2] || 0);
  const s = Number(m[3] || 0);
  return h * 3600 + min * 60 + s;
}

export function normalizeYouTubeVideo(item: YtItem) {
  const id = typeof item?.id === 'string' ? item.id : item?.id?.videoId;
  const snippet = item?.snippet || {};
  const content = item?.contentDetails || {};
  const stats = item?.statistics || {};
  const duration = content.duration as string | undefined;

  return {
    youtubeId: id || null,
    title: snippet.title || '',
    description: snippet.description || '',
    publishedAt: snippet.publishedAt || null,
    channelTitle: snippet.channelTitle || '',
    duration,
    durationSeconds: parseISODurationToSeconds(duration),
    thumbnails: snippet.thumbnails || {},
    tags: snippet.tags || [],
    statistics: stats,
  };
}

