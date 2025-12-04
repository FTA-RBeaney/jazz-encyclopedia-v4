import { useQuery } from "@tanstack/vue-query";
import type { UseQueryOptions } from "@tanstack/vue-query";

// composables/useVideosByTag.ts

export type VideosByTag = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export function useVideosByTag(
  tag: string,
  options: Partial<UseQueryOptions<VideosByTag[] | null, Error>> = {}
) {
  // Fetch latest videos (from Supabase API)
  const latest = useQuery<VideosByTag[] | null, Error>({
    queryKey: ["videosByTag", tag] as const,
    queryFn: () =>
      $fetch<VideosByTag[] | null>("/api/videos/tag", {
        query: { tag: tag },
      }),
    staleTime: 30_000, // 30s fresh
    gcTime: 5 * 60_000, // 5 min cache
    retry: 1,
    // Avoid refetch flicker on focus if undesired
    refetchOnWindowFocus: false,
    ...options,
  });

  // 4) Expose combined loading/error states and helpers
  const isLoading = latest.isLoading; // Ref<boolean>
  const isFetching = latest.isFetching; // Ref<boolean>
  const error = latest.error; // Ref<Error | null>
  const data = latest.data; // Ref<VideosByTag[] | null>

  const refetch = async () => {
    await latest.refetch();
  };

  return {
    data,
    isLoading,
    isFetching,
    error,
    latest, // expose raw query if caller wants finer control
    refetch,
  };
}
