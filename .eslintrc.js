module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,  // ⚡ important
    babelOptions: {
      presets: ['module:@react-native/babel-preset'],
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react'],
};