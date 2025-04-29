import { mergeConfigs } from '@unocss/core'
import config from './.nuxt/uno.config.mjs'

export default mergeConfigs([config, {
  theme: {
    fontFamily: {
      sans: 'Poppins',
    },
  },
}])
