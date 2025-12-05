<script lang="ts" setup></script>

<template>
  <div class="flex h-screen">
    <aside class="h-screen w-[300px] border-r">
      <UiScrollArea class="size-full">
        <div class="flex h-screen flex-col">
          <div class="relative border-b p-4">
            <NuxtLink to="#" class="flex items-center gap-3">
              <UiAvatar
                src="/icon.png"
                alt="Company Logo"
                class="flex size-8 items-center justify-center rounded-full bg-zinc-100 object-contain"
                fallback="JS"
                ><Icon name="lucide:book" class="text-primary size-4" />
              </UiAvatar>

              <div>
                <p class="font-jost font-bold">Jazz Encyclopedia</p>
                <p class="text-muted-foreground text-xs">Admin Dashboard</p>
              </div>
            </NuxtLink>
            <div class="absolute right-1 bottom-1">
              <ColorSwitcher />
            </div>
          </div>

          <div class="flex-1 p-4">
            <!-- <div class="dark:bg-primary/5 relative mb-4 flex flex-col gap-2 rounded-lg border p-3">
              <div class="mb-2 flex items-center gap-2">
                <Icon name="lucide:zap" class="text-primary size-3.5" />
                <span class="text-sm font-medium">Quick Actions</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <AddVideo />
                <AddBug />
              </div>
              
            </div> -->
            <!-- <UiBorderBeam :duration="15" /> -->
            <AppSidebar />
          </div>

          <UserAccountSubbaryCard />
        </div>
      </UiScrollArea>
    </aside>
    <div class="w-full">
      <UiScrollArea class="size-full bg-slate-50">
        <slot />
      </UiScrollArea>
    </div>
  </div>
</template>

<style scoped>
  @reference "tailwindcss";

  .font-jost {
    font-family: "Jost", sans-serif;
    text-transform: uppercase;
  }
</style>
