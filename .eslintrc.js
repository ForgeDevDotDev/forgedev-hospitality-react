module.exports = {
  root: true,
  env: { node: true, browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react-refresh'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-refresh/only-export-components': 'warn',
  },
  ignorePatterns: ['dist', 'node_modules'],
};
