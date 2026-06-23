const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...require("expo/metro-config").getDefaultConfig(__dirname).resolver.extraNodeModules,
  buffer: require.resolve("buffer/"),
};

module.exports = config;
