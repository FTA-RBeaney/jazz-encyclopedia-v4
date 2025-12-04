import { useQuery } from "@tanstack/vue-query";
import type { UseQueryOptions } from "@tanstack/vue-query";

import { videosKeys } from "./queryKeys";

// composables/useLatestVideo.ts

export type Video = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

type YtDetails = any; // shape depends on your /api/youtube/getVideoData response

export function useLatestVideo(options: Partial<UseQueryOptions<Video | null, Error>> = {}) {
  // 1) Fetch latest video (from Supabase)
  const latest = useQuery<Video | null, Error>({
    queryKey: videosKeys.latest(),
    queryFn: () => $fetch<Video | null>("/api/videos/latest"),
    staleTime: 30_000, // 30s fresh
    gcTime: 5 * 60_000, // 5 min cache
    retry: 1,
    ...options,
  });

  // 2) Fetch YouTube details AFTER we have the URL
  const ytEnabled = computed(() => !!latest.data.value?.url);
  const yt = useQuery<YtDetails, Error>({
    queryKey: computed(() => ["videoData", latest.data.value?.url] as const),
    enabled: ytEnabled,
    queryFn: () =>
      $fetch<YtDetails>("/api/youtube/getVideoData", {
        query: { q: latest.data.value!.url },
      }),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  // 3) Combine results (supabase row + YouTube details)
  const data = computed(() => {
    const base = latest.data.value;
    if (!base) return null;
    return {
      ...base,
      youtube: yt.data.value ?? null,
    } as const;
  });

  // 4) Expose combined loading/error states and helpers
  const isLoading = computed(() => latest.isLoading.value || (ytEnabled.value && yt.isLoading.value));
  const error = computed<Error | null>(() => latest.error.value ?? yt.error.value ?? null);

  const refetch = async () => {
    await latest.refetch();
    if (ytEnabled.value) await yt.refetch();
  };

  return {
    data,
    isLoading,
    error,
    latest, // expose raw query if caller wants finer control
    yt,
    refetch,
  };
}
