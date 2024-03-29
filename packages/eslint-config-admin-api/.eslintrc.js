module.exports = {
  extends: [
    '@nodite-light/eslint-config-base',
    'airbnb-base',
    'airbnb-typescript',
    'plugin:security/recommended-legacy',
    'eslint:recommended',
    'plugin:node/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['jest', 'security'],
  rules: {
    // TODO: resolve the following offs
    'import/extensions': 'off',
    'node/no-missing-import': 'off',
    'react/jsx-filename-extension': 'off',
    'node/file-extension-in-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/exports-style': ['error', 'module.exports'],
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/console': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-global/url-search-params': ['error', 'always'],
    'node/prefer-global/url': ['error', 'always'],
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',
    'class-methods-use-this': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        tryExtensions: ['.js', '.json', '.node', '.ts', '.d.ts'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};
