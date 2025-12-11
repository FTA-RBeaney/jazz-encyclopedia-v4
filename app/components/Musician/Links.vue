<script setup>
  const props = defineProps({
    musicianId: {
      type: [String, Number],
      required: true,
    },
  });

  const navList = [
    {
      title: "BUDDY RICH IMPOSSIBLE DRUM SOLO *HQ*",
      icon: "lucide:youtube",
      link: "/components/avatar",
    },
    {
      title: "Buddy Rich - Bugle Call Rag",
      icon: "lucide:youtube",
      link: "/components/avatar",
    },
    {
      title: "The Muppet Show - Buddy Rich vs Animal Drum Battle",
      icon: "lucide:youtube",
      link: "/components/avatar",
    },
  ];
</script>

<template>
  <UiCard class="m-0">
    <template #header>
      <div class="flex items-center justify-between px-6">
        <h2 class="text-lg font-semibold tracking-tight">Links</h2>
        <UiButton size="sm" variant="outline" class="mt-2"
          ><Icon name="lucide:plus" class="mr-0 h-4 w-4" />Add Link</UiButton
        >
      </div>
    </template>
    <template #content>
      <UiCardContent>
        <!-- <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">Links</h2>
      </div> -->
        <div class="flex items-center justify-center">
          <UiList class="">
            <template v-for="n in navList" :key="n.title">
              <UiListItem :to="n.link" class="">
                <Icon :name="n.icon" class="text-muted-foreground h-5 w-5" />
                <UiListContent>
                  <UiListTitle :title="n.title" class="text-sm font-medium" />
                </UiListContent>
                <span class="text-muted-foreground/70 ml-auto shrink-0 self-center rounded-full">
                  <Icon name="lucide:chevron-right" />
                </span>
              </UiListItem>
              <UiSeparator class="my-2.5 ml-auto w-[95%] last:hidden" />
            </template>
          </UiList>
        </div>
      </UiCardContent>
    </template>
  </UiCard>
</template>
