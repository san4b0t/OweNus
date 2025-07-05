// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');

// const defaultConfig = getDefaultConfig(__dirname);
// defaultConfig.resolver.sourceExts.push('cjs');
// defaultConfig.resolver.unstable_enablePackageExports = false;

// module.exports = defaultConfig;

const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
<<<<<<< HEAD
config.resolver.assetExts.push('bin');
=======
>>>>>>> d0ac0c7e40e7e85af1542f61636785594387843f
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;
module.exports = config;