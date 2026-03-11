<script setup lang="ts">
  definePageMeta({
    layout: "shell",
  });

  const { getUsers } = useFetchUsers();
  const { data: users } = getUsers();

  const sbUser = useSupabaseUser();
  const { fetchProfile } = useUserStore();
  const { profile } = storeToRefs(useUserStore());

  if (sbUser.value && sbUser.value.sub) {
    await fetchProfile(sbUser.value.sub);
  }
</script>
<template>
  <UiContainer class="mt-6 !w-full !max-w-full gap-4 lg:flex">
    <div class="grid w-full grid-cols-12 gap-6">
      <div class="col-span-3">
        <UiCard>
          <UiCardContent>
            <div class="grid gap-2">
              <div>
                <h2 class="text-lg font-semibold tracking-tight">Recent users:</h2>
              </div>
              <div class="grid grid-cols-3 gap-2 xl:grid-cols-6">
                <div
                  v-for="(user, i) in users"
                  :key="user.id || i"
                  class="overflow-hidden rounded-sm"
                >
                  <UiAvatar v-if="user" class="flex h-auto w-full items-center gap-2">
                    <UiAvatarImage :src="user.avatar_url" />
                    <UiAvatarFallback
                      ><img
                        src="https://api.dicebear.com/7.x/lorelei/svg?flip=false"
                        alt="John Doe"
                        class="aspect-square h-full w-full object-cover"
                    /></UiAvatarFallback>
                  </UiAvatar>
                </div>
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </div>
      <div class="col-span-6">
        <DashboardFeed />
      </div>
      <div class="col-span-3">
        <UiCard class="overflow-hidden p-0">
          <UiCardContent class="p-0">
            <img :src="profile?.avatar_url" class="aspect-video rounded-lg object-cover" />
            <div class="p-4">
              <h2 class="text-lg font-semibold tracking-tight">{{ profile?.first_name }}</h2>
              <p class="text-muted-foreground text-sm">{{ profile?.email }}</p>
            </div>

            <!-- <pre>{{ profile }}</pre> -->
          </UiCardContent>
        </UiCard>
      </div>
    </div>
  </UiContainer>
</template>
