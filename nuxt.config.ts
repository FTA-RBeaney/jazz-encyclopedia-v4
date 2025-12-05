// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { vite as vidstack } from "vidstack/plugins";
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css", "~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss(), svgLoader(), vidstack()],
    optimizeDeps: {
      include: ["cookie", "@supabase/ssr",'@supabase/supabase-js'],
    },
  },

  nitro: {
    preset: "cloudflare_pages",
  },

    googleFonts: {
    preload: true,
    display: "block",
    families: {
      Jost: [800],
      Lato: [100, 300],
      Lora: [400, 700],
      Roboto: [100, 300, 400, 500, 700, 900],
    },
  },


  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxtjs/supabase",
    "@nuxtjs/color-mode",
    "motion-v/nuxt",
    "@vueuse/nuxt",
    "@peterbud/nuxt-query",
    "@pinia/nuxt",
    "vue-sonner/nuxt",
    "@nuxt/ui",
    "@nuxtjs/google-fonts",
  ],

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
      {
        from: "vue-sonner",
        name: "toast",
        as: "useSonner",
      },
    ],
  },

  colorMode: {
    storageKey: "jazz-encyclopedia-v4-color-mode",
    classSuffix: "",
  },

  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 0,
    },

    mode: "svg",
    class: "shrink-0",
    fetchTimeout: 2000,
  },

  supabase: {
    redirectOptions: {
    login: '/login',
    callback: '/confirm',
    include: undefined,
    exclude: ['/login', '/confirm'],
    saveRedirectToCookie: false,
  },
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  build: {
    transpile: ["@supabase/ssr"],
  },

  nuxtQuery: {
    /**
     * Specify which Vue Query composables to auto-import
     * Default: `false`, set to `true` to auto-import all Vue Query composables
     */
    autoImports: ["useQuery", "useMutation"],

    // Enable/disable Nuxt DevTools integration (default: true)
    devtools: true,

    /**
     * These are the same options as the QueryClient
     * from @tanstack/vue-query, which will be passed
     * to the QueryClient constructor
     * More details: https://tanstack.com/query/v5/docs/reference/QueryClient
     */

    queryClientOptions: {
      defaultOptions: {
        queries: {
          // for example disable refetching on window focus
          refetchOnWindowFocus: false,
        },
      },
    },
  },

  app: {
    head: {
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/pdfmake.min.js",
          defer: true,
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/vfs_fonts.min.js",
          defer: true,
        },
      ],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("media-"),
    },
  },

  runtimeConfig: {
    public: {
      monzoId: process.env.MONZO_ID,
      monzoToken: process.env.MONZO_TOKEN,
      monzoAccountId: process.env.MONZO_ACCOUNT_ID,
    },
  },
});
