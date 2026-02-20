import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import withNuxt from '.nuxt/eslint.config.mjs';

export default withNuxt(eslintPluginPrettierRecommended).overrideRules({
  'prettier/prettier': [
    'error',
    {
      singleQuote: true,
      trailingComma: 'none'
    }
  ],
  quotes: [
    'error',
    'single',
    {
      allowTemplateLiterals: true
    }
  ]
});
