import { useQuery } from "@tanstack/vue-query";

export function useFetchArticles() {
  const supabase = useSupabaseClient();
  // Query to get all dancers
  const getAllArticles = () => {
    return useQuery({
      queryKey: ["articles"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("title", { ascending: true });

        if (error) throw error;
        return data;
      },
    });
  };

  const getArticlesOfType = (type: string) => {
    return useQuery({
      queryKey: ["articles", type],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("type", type)
          .order("title", { ascending: true });

        if (error) throw error;
        return data;
      },
    });
  };

  return {
    getAllArticles,
    getArticlesOfType,
  };
}
