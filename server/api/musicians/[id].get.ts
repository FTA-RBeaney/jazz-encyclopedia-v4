import { serverSupabaseClient } from "#supabase/server";
import createDOMPurify from "dompurify";
import { getRouterParam } from "h3";

type Musician = {
  id: string;
  name: string;
  content: string;
  featured_image: string | null;
  // add other columns as needed
};

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
    throw createError({
      statusCode: 404,
      message: `Musician not found: ${error.message}`,
    });
  }

  return { ...musician, content: musician.content };
});
