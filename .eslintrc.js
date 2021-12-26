import { rules } from './src/config/eslint-rules';

module.exports = {
  extends: ['google', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: rules
};
