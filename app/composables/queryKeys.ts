// composables/queryKeys.ts
export const videosKeys = {
  all: ["videos"] as const,
  latest: () => [...videosKeys.all, "latest"] as const,
};
