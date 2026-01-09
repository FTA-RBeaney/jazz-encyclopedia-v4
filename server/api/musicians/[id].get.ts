import { serverSupabaseClient } from "#supabase/server";
import { getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const supabase = await serverSupabaseClient(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Musician ID is required",
    });
  }

  const { data: musician, error } = await supabase
    .from("musicians")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Failed to fetch musician ${id}:`, error);
    throw createError({
      statusCode: 404,
      message: "Musician not found",
    });
  }

  return musician;
});
