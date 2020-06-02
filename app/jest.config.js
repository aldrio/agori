const expoPreset = require('jest-expo/jest-preset')
const jestPreset = require('@testing-library/react-native/jest-preset')

module.exports = {
  ...expoPreset,
  ...jestPreset,
  setupFiles: [...expoPreset.setupFiles, ...jestPreset.setupFiles],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|@ui-kitten/.*)',
  ],
}
