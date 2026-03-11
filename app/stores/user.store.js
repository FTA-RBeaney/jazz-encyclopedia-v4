import { useSupabaseClient } from "#imports";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const client = useSupabaseClient();
  const userId = ref(null);
  const profile = ref(null);

  async function fetchProfile(id) {
    userId.value = id;
    const { data, error } = await client.from("profiles").select("*").eq("id", id).single();
    if (!error) profile.value = data;
    return profile.value;
  }

  async function fetchStats() {
    const stats = await $fetch("/api/profile/stats");

    if (stats && profile.value) {
      profile.value.stats = stats;
      return stats;
    }
  }

  return { userId, profile, fetchProfile, fetchStats };
});
