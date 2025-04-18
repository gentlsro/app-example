// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    ['github:gentlsro/UI#zod_upgrade'],
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

  // i18n
  i18n: {
    strategy: 'prefix_and_default',
    skipSettingLocaleOnNavigate: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      cookieDomain: undefined,
    },
    langDir: '../i18n',
    defaultLocale: 'en-US',
    locales: [
      {
        code: 'en-US',
        file: 'en-US.json',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        icon: 'i-emojione:flag-for-united-kingdom',
      },
      {
        code: 'cs-CZ',
        file: 'cs-CZ.json',
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
