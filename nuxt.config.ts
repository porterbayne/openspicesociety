// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
  ],

  primevue: {
    options: {
    }
  },
  css: [
    'primevue/resources/themes/aura-light-teal/theme.css',
    // 'primevue/resources/primevue.min.css',
    'primeicons/primeicons.css',
  ],

  build: {
    transpile: ['primevue']
  },

  supabase: {
    url: process.env.NODE_ENV === 'production' 
      ? process.env.SUPABASE_URL_PROD 
      : process.env.SUPABASE_URL_DEV,
    key: process.env.NODE_ENV === 'production' 
      ? process.env.SUPABASE_KEY_PROD 
      : process.env.SUPABASE_KEY_DEV,
    redirectOptions: {
      // login: '/',
      // callback: '/confirm',
      login: '/auth/callback',
      callback: '/auth/callback',
      exclude: ['/*'],
    },
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NODE_ENV === 'production' 
        ? process.env.SUPABASE_URL_PROD 
        : process.env.SUPABASE_URL_DEV,
      supabaseKey: process.env.NODE_ENV === 'production' 
        ? process.env.SUPABASE_KEY_PROD 
        : process.env.SUPABASE_KEY_DEV,
      shopifyStorefrontDomain: process.env.SHOPIFY_STOREFRONT_DOMAIN,
      shopifyStorefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
    }
  },

  app: {
    head: {
      title: 'Open Spice Society',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  compatibilityDate: '2025-02-17'
})