import { serverSupabaseClient } from "#supabase/server";

/**
 * Admin API Endpoint: Comments for a post
 *
 * Returns all data from the database
 * URL: /api/admin/attendees
 */
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);

  if (!event?.context?.params?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Post ID is required",
    });
  }

  const { data, error, count } = await supabase
    .from("comments")
    .select(`*, profiles!comments_email_fkey(*)`, { count: "exact" })
    .eq("post_id", event.context.params.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch comments",
    });
  }

  return {
    comments: data,
    count: count ?? data?.length ?? 0,
  };
});
