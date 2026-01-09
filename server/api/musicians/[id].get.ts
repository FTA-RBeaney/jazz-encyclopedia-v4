import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const supabase = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Musician ID is required",
    });
  }

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const { data: musician, error } = await supabase
    .from("musicians")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Failed to fetch musician:`, error.message || "Unknown error");

    // PGRST116 is Supabase's "no rows returned" error code
    if (error.code === "PGRST116") {
      throw createError({
        statusCode: 404,
        message: "Musician not found",
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to fetch musician",
    });
  }

  return musician;
});
