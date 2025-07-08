// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    ['github:gentlsro/UI#zod-migration'],
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
    langDir: '../i18n',
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
    locales: [
      {
        code: 'en-US',
        file: `en-US.json`,
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        icon: 'i-emojione:flag-for-united-kingdom',
      },
      {
        code: 'cs-CZ',
        file: `cs-CZ.json`,
        dateFormat: 'DD.MM.YYYY',
        currency: 'CZK',
        icon: 'i-emojione:flag-for-czechia',
      },
    ],
  },

  unocss: {
    nuxtLayers: true,
    safelist: ['i-emojione:flag-for-united-kingdom', 'i-emojione:flag-for-czechia'],
  },
})
