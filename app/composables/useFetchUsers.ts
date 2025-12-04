import { useQuery } from "@tanstack/vue-query";

export function useFetchUsers() {
  const supabase = useSupabaseClient();

  const getUsers = () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const { data, error } = await supabase.from("profiles").select("*");

        if (error) throw error;
        return data;
      },
    });
  };

  return {
    getUsers,
  };
}
