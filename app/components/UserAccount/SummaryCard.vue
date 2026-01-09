<script setup lang="ts">
  type User = {
    id: string;
    first_name: string;
    email: string;
    avatar_url: string;
  };

  const sbUser = useSupabaseUser();
  const { fetchProfile } = useUserStore();
  const { profile } = storeToRefs(useUserStore());

  //get stats
  const { data: stats } = await useFetch("/api/profile/stats");

  const signOut = async () => {
    const supabase = useSupabaseClient();
    await supabase.auth.signOut();
    navigateTo("/login");
  };

  watch(
    sbUser,
    async (val) => {
      if (val && val.sub) {
        // or val.sub if that's correct
        await fetchProfile(val.sub);
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="border-t p-4">
    <div class="mb-3 flex items-center gap-3">
      <UiAvatar :src="profile?.avatar_url" class="size-10" />

      <div class="flex-1">
        <p class="text-sm font-semibold">{{ profile?.first_name }}</p>
        <p class="text-muted-foreground text-xs">{{ profile?.email }}</p>
      </div>
      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <UiButton size="icon-sm" variant="ghost">
            <Icon name="lucide:more-vertical" class="text-muted-foreground size-4" />
          </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent align="end">
          <NuxtLink to="/account">
            <UiDropdownMenuItem>
              <Icon name="lucide:user" class="size-4" />
              Profile
            </UiDropdownMenuItem>
          </NuxtLink>
          <UiDropdownMenuItem>
            <Icon name="lucide:settings" class="size-4" />
            Settings
          </UiDropdownMenuItem>
          <UiDropdownMenuSeparator />
          <UiDropdownMenuItem variant="destructive" @click="signOut()">
            <Icon name="lucide:log-out" class="size-4" />
            Sign out
          </UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </div>
    <UiProgress :model-value="stats?.level?.progressPct" class="h-1.5" />
    <p class="text-muted-foreground mt-2 text-xs">
      {{ stats?.level?.totalXP }} / {{ stats?.level?.nextLevelXP }} XP
    </p>
  </div>
</template>
