module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // transform JS/TS/TSX using Babel
  },
  transformIgnorePatterns: [
    // Transform react-native and other ESM packages
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-js-polyfills)/)',
  ],
  setupFiles: ['<rootDir>/jest/setup.js'],
  testEnvironment: 'jsdom', // better for RN components
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};