<script setup lang="ts">




  type Child = { title: string; link: string; icon?: string; avatar_url?: string };
  type Item = {
    title: string;
    icon?: string;
    link?: string;
    badge?: string;
    badgeVariant?: string;
    children?: Child[];
  };
  type Section = { title: string; items: Item[] };

  const supabase = useSupabaseClient();
  //get tags for the sidebar
  const { data: tags } = await useAsyncData(
    "video-tags-page",
    async () => {
      const { data, error } = await supabase.from("video_tags_with_counts").select("*");
      if (error) throw error;
      return data ?? [];
    },
    {
      server: false,
      default: () => [],
    }
  );

  // get a list of users for the sidebar
  const { getUsers } = useFetchUsers();
  const { data: users } = getUsers();

  // populate sidebar navigation
  const userNavigation = computed<Child[]>(() =>
    users.value
      ? users.value.map((user) => ({
          title: user.first_name || "Unnamed",
          link: `/user-videos/${user.id}`,
          avatar_url: user.avatar_url,
        }))
      : []
  );

  const tagsNavigation = computed<Child[]>(() =>
    tags.value
      ? tags.value.map((tag) => ({
          title: tag.tag,
          link: `/inspiration/${tag.tag}`,
          icon: "lucide:tag",
        }))
      : []
  );

  const sections = computed<Section[]>(() => [
    {
      title: "Main",
      items: [
        { title: "Dashboard", icon: "lucide:home", link: "/" },
        // {
        //   title: "Analytics",
        //   icon: "lucide:bar-chart-2",
        //   link: "/new-videos",
        // },
        // { title: "Reports", icon: "lucide:file-text", link: "#" },
      ],
    },
    {
      title: "Inspiration",
      items: [
        { title: "New Videos", icon: "lucide:video", link: "/new-videos" },
        { title: "Popular Videos", icon: "lucide:globe", link: "/popular-videos" },
        {
          title: "User videos",
          icon: "lucide:users",
          children: userNavigation.value,
        },
        {
          title: "Tags",
          icon: "lucide:tag",
          children: tagsNavigation.value,
        },
      ],
    },
    {
      title: "Resources",
      items: [
        { title: "Articles", icon: "lucide:book", link: "/articles" },
        { title: "Videos", icon: "lucide:video", link: "/videos" },
        { title: "Podcasts", icon: "lucide:rss", link: "/podcasts" },
        { title: "Books", icon: "lucide:book", link: "/books" },
        {
          title: "Blog",
          icon: "lucide:edit-3",
          link: "/blog",
          badge: "New",
          badgeVariant: "default",
        },
      ],
    },
    {
      title: "Support",
      items: [
        // { title: "Documentation", icon: "lucide:book-open", link: "#" },
        // { title: "Help Center", icon: "lucide:help-circle", link: "#" },
        { title: "Feedback", icon: "lucide:message-square", link: "/bugs" },
      ],
    },
  ]);
</script>

<template>
  <nav class="flex flex-col gap-6">
    <div v-for="(section, index) in sections" :key="index">
      <div class="mb-2 px-2">
        <span class="text-muted-foreground/70 text-xs tracking-wider uppercase">{{
          section.title
        }}</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <template v-for="(item, i) in section.items" :key="i">
          <UiButton
            v-if="!('children' in item)"
            :to="item.link"
            size="sm"
            variant="ghost"
            class="justify-start gap-3 px-2"
          >
            <Icon v-if="item.icon" :name="item.icon" class="text-muted-foreground size-4" />
            <span>{{ item.title }}</span>
            <UiBadge
              v-if="item.badge"
              :variant="(item.badgeVariant as any) || 'secondary'"
              class="ml-auto h-5 px-1.5 text-xs"
            >
              {{ item.badge }}
            </UiBadge>
          </UiButton>
          <UiCollapsible v-else>
            <UiCollapsibleTrigger as-child>
              <UiButton size="sm" variant="ghost" class="group w-full justify-start gap-3 px-2">
                <Icon v-if="item.icon" :name="item.icon" class="text-muted-foreground size-4" />
                <span>{{ item.title }}</span>
                <Icon
                  name="lucide:chevron-down"
                  class="text-muted-foreground ml-auto size-4 transition group-data-[state=open]:rotate-180"
                />
              </UiButton>
            </UiCollapsibleTrigger>
            <UiCollapsibleContent class="flex flex-col gap-0.5 pr-2 pl-6">
              <UiButton
                v-for="(child, ci) in item.children"
                :key="ci"
                :to="child.link"
                size="sm"
                variant="ghost"
                class="justify-start gap-3 px-2"
              >
                <UiAvatar v-if="child.avatar_url" class="flex size-6 items-center gap-2">
                  <UiAvatarImage :src="child.avatar_url" />
                  <UiAvatarFallback
                    ><img
                      src="https://api.dicebear.com/7.x/lorelei/svg?flip=false"
                      alt="John Doe"
                      class="aspect-square h-full w-full object-cover"
                  /></UiAvatarFallback>
                </UiAvatar>
                <Icon
                  v-else-if="child.icon"
                  :name="child.icon"
                  class="text-muted-foreground size-4"
                />
                <span>{{ child.title }}</span>
              </UiButton>
            </UiCollapsibleContent>
          </UiCollapsible>
        </template>
      </div>
    </div>
  </nav>
</template>
