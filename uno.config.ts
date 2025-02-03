import { mergeConfigs } from 'unocss'
import { join } from 'node:path'

// The path relative to the current working directory
// as UnoCSS is only saved in the final layer
const unoConfigPath = join(process.cwd(), '.nuxt', 'uno.config.mjs')

// Require the configuration synchronously
// NOTE: This is fucking stupid but we cannot `await import()` here because uno just can't handle that
// eslint-disable-next-line ts/no-require-imports
const config = require(unoConfigPath).default ?? {}

export default mergeConfigs([
  config,
  {},
])
