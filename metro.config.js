// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable web support
  isCSSEnabled: true,
});

// Add resolution for web-specific extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'web.js',
  'web.jsx',
  'web.ts',
  'web.tsx',
  'mjs',
];

// Add support for additional asset types
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'pem',
  'cjs',
];

// Use the project's web directory for the template
config.transformer.publicPath = '/assets';

module.exports = config;
