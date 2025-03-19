// @ts-nocheck
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
    },
  ),
)
  .append({
    ignores: [
      '.fttemplates',
      'prisma/generated',
      'i18n',
      'shims.d.ts',
    ],
  })
  .overrideRules({
    'vue/max-attributes-per-line': ['warn', { singleline: 1, multiline: { max: 1 } }],
    'ts/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
    'ts/consistent-type-definitions': ['warn', 'type'],
    'curly': ['warn', 'all'],
    'vue/max-len': ['warn', { code: 120, template: 120, ignorePattern: '^import .*' }],
    '@stylistic/brace-style': 'off',
    'style/brace-style': 'off',
    'no-console': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-text-v-html-on-component': 'warn',
    'node/prefer-global/process': ['warn', 'always'],
    'ts/no-use-before-define': 'off',
    'ts/ban-types': 'off',
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-imports-ts': 'off',
    'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'ts/ban-ts-comment': 'off',
    'unocss/order-attributify': 'off',
    'unocss/order': 'off',

    '@stylistic/arrow-parens': ['warn', 'as-needed'],
    'style/arrow-parens': ['warn', 'as-needed'],
    'vue/custom-event-name-casing': 'off',

    'style/quotes': ['warn', 'single', { avoidEscape: true }],
    '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
    'perfectionist/sort-imports': ['off'],
    'unicorn/consistent-function-scoping': 'off',
    'perfectionist/sort-objects': 'off',
    'ts/no-unsafe-function-type': 'off',
  })
