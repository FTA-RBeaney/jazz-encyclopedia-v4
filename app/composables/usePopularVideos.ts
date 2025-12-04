import { useQuery } from "@tanstack/vue-query";
import type { UseQueryOptions } from "@tanstack/vue-query";

// Define the YouTube video snippet type for better type safety
type YouTubeSnippet = {
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  channelTitle: string;
  publishedAt: string;
};

export type PopularVideo = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  views?: number;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  youtube?: {
    id: string | { videoId: string };
    snippet: YouTubeSnippet;
    contentDetails?: {
      duration: string;
      dimension: string;
      definition: string;
      caption: string;
      licensedContent: boolean;
    };
    statistics?: {
      viewCount: string;
      likeCount?: string;
      commentCount?: string;
    };
  };
};

export function usePopularVideos(
  options: Partial<UseQueryOptions<PopularVideo[] | null, Error>> = {}
) {
  // Fetch popular videos from the optimized endpoint
  const popularVideosQuery = useQuery<PopularVideo[] | null, Error>({
    queryKey: ["popularVideos"],
    queryFn: async () => {
      try {
        return await $fetch<PopularVideo[]>("/api/videos/optimized-popular");
      } catch (error) {
        console.error('Error fetching popular videos:', error);
        throw error;
      }
    },
    staleTime: 5 * 60_000, // 5 minutes before considered stale
    gcTime: 30 * 60_000, // 30 minutes cache
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  });

  return {
    data: popularVideosQuery.data,
    isLoading: popularVideosQuery.isLoading,
    isFetching: popularVideosQuery.isFetching,
    error: popularVideosQuery.error,
    refetch: popularVideosQuery.refetch,
  };
}
