module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // The order of plugins is important
      '@babel/plugin-transform-export-namespace-from',
      'react-native-reanimated/plugin',
    ],
    // Add this to ensure correct CommonJS module handling
    sourceType: 'unambiguous',
  };
};
