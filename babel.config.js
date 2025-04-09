// This is a minimal babel config that should work with Expo
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: []
  };
};
