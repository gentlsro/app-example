// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    ['github:gentlsro/UI#master'],
  ],

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/eslint',
  ],

  // Imports https://nuxt.com/docs/api/configuration/nuxt-config#imports
  imports: {},

  srcDir: 'client/',

  // Future
  future: {
    compatibilityVersion: 4,
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: true,
    },
  },

  fonts: {
    defaults: {
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
    },
  },

  // i18n
  i18n: {
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },

  unocss: {
    nuxtLayers: true,
    safelist: ['i-emojione:flag-for-united-kingdom', 'i-emojione:flag-for-czechia'],
  },
})
