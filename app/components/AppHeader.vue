<script lang="ts" setup>
  const supabase = useSupabaseClient();
  // const accountStore = useAuthStore();
  // const userInfo = computed(() => accountStore?.getUser);
  // const { user } = storeToRefs(accountStore);

  const user = useSupabaseUser();
  const route = useRoute();

  const userInfo = computed(() => user?.value);
  const userAvatar = computed(() => {
    if (user.value) {
      return (user?.value as { avatar_url: string }).avatar_url;
    }
    return "";
  }) as Ref<string | null>;
  const userIsAdmin = computed(() => {
    if (userInfo.value) {
      return (userInfo?.value as { user_role: string }).user_role === "admin";
    }
    return false;
  });

  const { data } = await supabase
    .from("profiles")
    .select(`id, first_name, email, avatar_url, user_role`)
    .eq("id", user?.value?.id)
    .single();

  // accountStore.setUser(data);

  const musicNav = [
    {
      name: "Home",
      href: "/",
      published: true,
      image:
        "https://www.udiscovermusic.com/wp-content/uploads/2020/06/Duke-Ellington-Quiz-GettyImages-1163996910.jpg",
    },
    {
      name: "Courses",
      href: "/courses",
      published: false,
      image:
        "https://www.udiscovermusic.com/wp-content/uploads/2020/06/Duke-Ellington-Quiz-GettyImages-1163996910.jpg",
    },
    {
      name: "Dance",
      href: "/dancers",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiAJO9Szf6l6mOM8r47Q8TRmtzeQSAWHZNWYfMg4p_-v7TexxpI5jEP6OlhP7_mkwsBOk1Krm14I1lcKEdf_dona0QK045bWrNIefL5lrY1kPv9JUvKUsVdNPhOwPTkqtAfISva55TUTso/s1600/acrobatic-lindy.jpg",
      published: true,
      links: [
        {
          name: "Dancers",
          description: "Learn about key dancers, both classic and modern.",
          icon: "lucide:users",
          href: "/dancers",
        },
        {
          name: "Strolls",
          description: "Learn about the classic strolls.",
          icon: "lucide:footprints",
          href: "/strolls",
        },
        {
          name: "Classic steps",
          description: "Learn about the classic jazz steps.",
          icon: "lucide:footprints",
          href: "/solo",
        },
      ],
    },
    {
      name: "Videos",
      href: "/video",
      image: "https://reverentjuke.be/build/static/img/inner.59cfcb89.jpg",
      published: true,
      links: [
        {
          name: "Documentaries",
          description: "Documentaries and film clips",
          icon: "lucide:video",
          href: "/video",
        },
        {
          name: "Inspiration",
          description: "Inspiration from around the world",
          icon: "lucide:youtube",
          href: "/new-videos",
        },
        // {
        //   name: "User videos",
        //   description: "Collect and organise your favourite clips",
        //   icon: "lucide:video",
        //   href: "/user-videos",
        // },
        // {
        //   name: "Inspiration",
        //   description: "A collection of inspiration videos from IG",
        //   icon: "lucide:video",
        //   href: "/inspiration",
        // },
      ],
    },
    // {
    //   name: "Music",
    //   href: "/music",
    //   image:
    //     "https://www.udiscovermusic.com/wp-content/uploads/2020/06/Duke-Ellington-Quiz-GettyImages-1163996910.jpg",
    //   published: true,
    //   links: [
    //     {
    //       name: "Featured",
    //       description: "Get in touch with our team.",
    //       icon: "lucide:play",
    //       href: "/music",
    //     },
    //     {
    //       name: "Bands",
    //       description: "Learn more about our company and our team.",
    //       icon: "lucide:drum",
    //       href: "/bands",
    //     },
    //     {
    //       name: "Musicians",
    //       description: "Join our team and help us build the future.",
    //       icon: "lucide:piano",
    //       href: "/artists",
    //     },
    //   ],
    // },
    {
      name: "Resources",
      href: "/articles",
      image: "https://secretsofsolo.com/wp-content/uploads/2020/06/Memberpress-blog-cover.jpg",
      published: true,
      links: [
        {
          name: "Articles",
          description: "A list of articles about music, dance and culture.",
          icon: "lucide:file-text",
          href: "/articles",
        },
        {
          name: "Podcasts",
          description: "Various swing-related podcasts",
          icon: "lucide:rss",
          href: "/podcasts",
        },
        // {
        //   name: "Blogs",
        //   description: "",
        //   icon: "lucide:rss",
        //   href: "/blogs",
        // },
        {
          name: "Books",
          description: "A list of recommended reading",
          icon: "lucide:book",
          href: "/books",
        },
      ],
    },
    {
      name: "Changelog",
      description: "Latest updates and improvements to the platform",
      icon: "lucide:list-checks",
      href: "/changelog",
      published: true,
    },
  ];
  const miniLinks = [
    { name: "About us", href: "#" },
    { name: "Press", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Legal", href: "#" },
    { name: "Support", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Sitemap", href: "#" },
    { name: "Cookie settings", href: "#" },
  ];
</script>

<template>
  <header
    class="bg-background z-20 border-b backdrop-blur"
    :class="{
      'absolute top-0 left-0 w-full border-none bg-transparent text-white !shadow-none':
        route.path === '/video',
    }"
  >
    <div class="l-6/12 t-6/12 fixed z-20 w-40 bg-white"></div>
    <UiContainer class="flex h-16 items-center justify-between lg:h-20">
      <div class="flex items-center gap-10">
        <!-- <NuxtLink to="#" class="flex items-center gap-3">
          <img
            src="~/assets/images/LJC.png"
            alt="LJC Logo"
            fit="contain"
            class="h-6 object-contain lg:h-8"
            :class="{
              invert: route.path === '/video',
            }"
          />
        </NuxtLink> -->
        <UiNavigationMenu as="nav" class="hidden items-center justify-start gap-8 lg:flex">
          <UiNavigationMenuList class="gap-2">
            <UiNavigationMenuItem v-for="(item, i) in musicNav" :key="i">
              <template v-if="item.links && item.published">
                <UiNavigationMenuTrigger
                  :title="item.name"
                  class="text-inherit"
                  :class="!item.published ? 'bg-gray-200' : 'bg-transparent'"
                />

                <UiNavigationMenuContent>
                  <div class="grid w-[600px] grid-cols-2 gap-2 p-4">
                    <img
                      :src="item.image"
                      alt="Beach"
                      class="h-full w-full rounded-md object-cover"
                    />
                    <ul class="flex flex-col gap-2">
                      <li
                        v-for="(link, i) in item.links"
                        :key="i"
                        class="hover:bg-muted rounded-md p-3 text-sm"
                      >
                        <NuxtLink
                          :to="link.href"
                          class="hover:bg-muted/80 focus-visible:ring-ring/50 flex gap-4 rounded-md p-0 transition focus-visible:ring-2 focus-visible:outline-none"
                        >
                          <Icon :name="link.icon" class="text-primary mt-px h-5 w-5 shrink-0" />
                          <div class="flex flex-col gap-1.5 leading-none">
                            <p class="text-foreground mb-1 leading-none font-semibold">
                              {{ link.name }}
                            </p>
                            <p class="text-muted-foreground line-clamp-2 text-sm/5">
                              {{ link.description }}
                            </p>
                          </div>
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </UiNavigationMenuContent>
              </template>
              <template v-else>
                <UiNavigationMenuLink as-child v-if="item.published || userIsAdmin">
                  <UiButton
                    :to="item.href"
                    variant="ghost"
                    size="sm"
                    :class="!item.published ? 'bg-gray-100' : 'bg-transparent'"
                  >
                    {{ item.name }}
                  </UiButton>
                </UiNavigationMenuLink>
              </template>
            </UiNavigationMenuItem>
          </UiNavigationMenuList>
        </UiNavigationMenu>
      </div>
      <div class="lg:hidden">
        <UiSheet>
          <UiSheetTrigger as-child>
            <UiButton variant="ghost" size="icon-sm">
              <Icon name="lucide:menu" class="h-5 w-5" />
            </UiButton>
            <UiSheetContent class="w-[90%] p-0">
              <template #content>
                <UiSheetTitle class="sr-only" title="Mobile menu" />
                <UiSheetDescription class="sr-only" description="Mobile menu" />
                <UiSheetX class="z-20" />

                <UiScrollArea class="h-full p-5">
                  <div class="flex flex-col gap-2">
                    <template v-for="(data, link) in musicNav" :key="link">
                      <UiCollapsible v-if="data.links">
                        <UiCollapsibleTrigger as-child>
                          <UiButton
                            variant="link"
                            class="w-full justify-start text-base capitalize *:data-[state=open]:-rotate-180"
                            >{{ data.name }}
                            <Icon name="lucide:chevron-down" class="ml-auto h-4 w-4 transition"
                          /></UiButton>
                        </UiCollapsibleTrigger>
                        <UiCollapsibleContent
                          class="data-[state=closed]:animate-none data-[state=open]:p-3 data-[state=open]:pt-0"
                        >
                          <ul class="flex w-full flex-col gap-2">
                            <li v-for="(child, k) in data.links" :key="k">
                              <UiNavigationMenuLink class="data-[active]:bg-muted/80" as-child>
                                <NuxtLink
                                  :to="child.href"
                                  class="hover:bg-muted/80 focus-visible:ring-ring/50 flex gap-4 rounded-md p-3 transition focus-visible:ring-2 focus-visible:outline-none"
                                >
                                  <Icon
                                    :name="child.icon"
                                    class="text-primary mt-px h-5 w-5 shrink-0"
                                  />
                                  <div class="flex flex-col gap-1.5 leading-none">
                                    <p class="text-sm font-semibold">
                                      {{ child.name }}
                                    </p>
                                  </div>
                                </NuxtLink>
                              </UiNavigationMenuLink>
                            </li>
                          </ul>
                        </UiCollapsibleContent>
                      </UiCollapsible>
                      <NuxtLink
                        :to="data.href"
                        v-else-if="data.published || userIsAdmin"
                        variant="ghost"
                        class="justify-start text-base"
                      >
                        <UiButton variant="ghost" class="justify-start text-base">{{
                          data.name
                        }}</UiButton></NuxtLink
                      >
                    </template>

                    <UiGradientDivider class="my-5" />

                    <ul class="grid grid-cols-2 gap-x-3 gap-y-5 px-4">
                      <li v-for="(m, j) in miniLinks" :key="j">
                        <NuxtLink class="py-2" :to="m.href">{{ m.name }}</NuxtLink>
                      </li>
                    </ul>
                    <UiGradientDivider class="my-5" />
                    <UiButton to="/signin">Sign up</UiButton>
                    <UiButton variant="outline" to="/signin">Log in</UiButton>
                  </div>
                </UiScrollArea>
              </template>
            </UiSheetContent>
          </UiSheetTrigger>
        </UiSheet>
      </div>
      <div class="hidden items-center gap-3 lg:flex">
        <div v-if="!userInfo">
          <UiButton to="/signin" variant="ghost" size="sm">Log in</UiButton>
          <UiButton to="/signin" size="sm">Sign up</UiButton>
        </div>
        <UserAccountNotifications />

        <UserAccount v-if="userInfo" :user="userInfo" :src="userAvatar" :is-admin="userIsAdmin" />

        <!-- dark mode button -->
        <!-- <div class="flex items-center gap-1">
          <button @click="toggleDark()">
            <label
              for="dark-mode"
              class="flex w-10 items-center rounded-full bg-gray-200 p-1 dark:bg-gray-700"
              :class="isDark ? 'justify-end' : 'justify-start'"
            >
              <Icon
                :name="isDark ? 'lucide:moon' : 'lucide:sun'"
                class="h-4 w-4 text-yellow-500 dark:text-yellow-300"
              />
            </label>
          </button>
        </div> -->
      </div>
    </UiContainer>
  </header>
</template>
