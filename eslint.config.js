import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import importPlugin from 'eslint-plugin-import';
import vueParser from 'vue-eslint-parser';

export default [
  js.configs.recommended,
  {
    files: [ '**/*.vue', '**/*.js', '**/*.mjs' ],
    plugins: {
      vue,
      import: importPlugin
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        browser: true,
        gtag: true,
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        fetch: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        URLSearchParams: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        FormData: 'readonly'
      }
    },
    rules: {
      'comma-dangle': [ 'error', 'never' ],
      'quotes': 'off',
      'quote-props': [ 'error', 'consistent' ],
      'import/extensions': 'off',
      'import/order': 'off',
      'no-return-await': 'off',
      'prefer-template': 'off',
      'max-len': 'off',
      'array-bracket-spacing': [ 'error', 'always' ],
      'arrow-parens': [ 'error', 'as-needed' ],
      'padded-blocks': 'off',
      'no-restricted-syntax': [ 'off', 'iterators/generators' ],
      'no-console': 'off',
      'object-curly-newline': 'off',
      'no-continue': 'off',
      'no-param-reassign': [ 'error', { 'props': false } ],
      'no-return-assign': 'off',
      'no-plusplus': 'off',
      'no-use-before-define': 'off',
      'no-unused-vars': [ 'error', { 'varsIgnorePattern': '^_' } ],
      'no-underscore-dangle': 'off',
      'no-mixed-operators': 'off',
      'prefer-destructuring': 'off',
      'import/prefer-default-export': 'off',
      'import/no-relative-packages': 'off',
      'import/no-extraneous-dependencies': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'camelcase': 'off',
      'lines-between-class-members': [ 'error', 'always', { 'exceptAfterSingleLine': true } ]
    }
  }
];
