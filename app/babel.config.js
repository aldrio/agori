module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['./src'],
          extensions: ['.ios.ts', '.android.ts', '.ts', '.tsx', '.json'],
        },
      ],
    ],
  }
}
