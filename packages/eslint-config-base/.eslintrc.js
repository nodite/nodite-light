module.exports = {
  env: {
    es2021: true,
    jest: true,
    node: true,
  },
  extends: [
    '../../.eslintrc',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'jsx-a11y',
    'prettier',
    'simple-import-sort',
    'tsdoc',
    'unused-imports',
    'eslint-plugin-import',
  ],
  ignorePatterns: ['lib'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'tsdoc/syntax': 'off',
    'max-len': [
      'error',
      {
        code: 100,
      },
    ],
    'class-methods-use-this': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        endOfLine: 'auto',
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
};
