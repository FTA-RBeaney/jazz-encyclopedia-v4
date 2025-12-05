<script setup>
  import { useTheme } from "~/composables/useTheme";
  import { computed, onMounted, ref } from "vue";

  definePageMeta({
    layout: "admin",
  });

  // Use the user store
  const supabase = useSupabaseClient();
  const sbUser = useSupabaseUser();
  const { fetchProfile, profile } = useUserStore();
  const user = computed(() => profile);

  // Reactive state
  const loading = ref(true);
  // const username = ref("");
  // const website = ref("");
  const avatar_path = ref(null);
  const favourites = ref([]);

  // Computed current user
  const currentUser = computed(() => {
    if (!user.value) return null;

    const u = user.value;
    return u;
  });

  // Update profile function
  // async function updateProfile() {
  //   try {
  //     const userId = currentUser.value && currentUser.value.id;
  //     if (!userId) {
  //       throw new Error("User not authenticated");
  //     }

  //     loading.value = true;
  //     const { error } = await supabase.from("profiles").upsert({
  //       id: userId,
  //       username: username.value,
  //       website: website.value,
  //       avatar_url: avatar_path.value,
  //       updated_at: new Date().toISOString(),
  //     });

  //     if (error) throw error;

  //     notificationStore.notify("Profile updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     notificationStore.notify("Failed to update profile", "error");
  //   } finally {
  //     loading.value = false;
  //   }
  // }

  // Tabs configuration
  const tabs = [
    {
      title: "Settings",
      value: "tab-1",
      icon: "lucide:settings",
    },
    {
      title: "Favourites",
      value: "tab-2",
      icon: "lucide:heart",
    },
  ];

  // Fetch favorites when component is mounted
  onMounted(() => {
    if (sbUser.value?.sub) {
      fetchProfile(sbUser.value.sub);
    }

    (async () => {
      try {
        if (!currentUser?.value?.id) {
          console.warn("Cannot fetch favorites: No authenticated user or user ID");
          loading.value = false;
          return;
        }

        loading.value = true;
        const { data, error } = await supabase
          .from("favourites")
          .select("*")
          .eq("user_id", currentUser.value.id);

        if (error) {
          console.error("Error fetching favorites:", error);
          notificationStore.notify("Failed to load favorites", "error");
        } else if (data) {
          favourites.value = data;
        }
      } catch (error) {
        console.error("Error:", error);
        notificationStore.notify("An error occurred", "error");
      } finally {
        loading.value = false;
      }
    })();
  });
</script>
<template>
  <div class="container mx-auto p-6">
    <UiTabs :default-value="tabs[0].value">
      <div class="flex justify-start">
        <UiTabsList :pill="false" class="relative bg-transparent">
          <UiTabsTrigger
            v-for="t in tabs"
            :key="t.value"
            :pill="false"
            :value="t.value"
            class="relative gap-2 rounded-none py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {{ t.title }}
          </UiTabsTrigger>
          <UiTabsIndicator />
        </UiTabsList>
      </div>
      <UiTabsContent value="tab-1">
        <UiCard class="max-w-3xl">
          <UiCardContent>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3">
                <div class="px-4 sm:px-0">
                  <h2 class="font-bold tracking-tight">Settings</h2>
                  <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                    Change your profile picture and details.
                  </p>
                </div>
              </div>

              <div class="col-span-9">
                <div class="mb-2">
                  <UploadAvatar v-model:path="avatar_path" />
                </div>
                <UserAccountDetails v-if="currentUser" :user="currentUser" />
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </UiTabsContent>
      <UiTabsContent value="tab-2">
        <UiCard>
          <UiCardContent>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3">
                <div class="px-4 sm:px-0">
                  <h2 class="font-bold tracking-tight">Favourites</h2>
                  <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                    Your favourite artists, dancers, bands and articles.
                  </p>
                </div>
              </div>

              <div class="col-span-9">
                <div class="">
                  <FavouritesDataTable :data="favourites" class="mt-4" />
                </div>
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </UiTabsContent>
    </UiTabs>

    <!-- <h3 class="py-4">Members</h3>

    <TeamMembers v-if="activeAccountMembers" :members="activeAccountMembers" /> -->
  </div>
</template>
