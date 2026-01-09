import { useQuery } from "@tanstack/vue-query";

export function useFetchDocumentaries() {
  const supabase = useSupabaseClient();
  // Query to get all dancers
  const getAllDocumentaries = () => {
    return useQuery({
      queryKey: ["documentaries"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("documentaries")
          .select("*")
          .order("title", { ascending: true });

        if (error) throw error;
        return data;
      },
    });
  };

  return {
    getAllDocumentaries,
  };
}
