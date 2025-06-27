const { getDefaultConfig } = require('expo/metro-config');
const nodeLibs = require('node-libs-react-native');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;
module.exports = {
    ...config,
    resolver: {
        ...config.resolver,
        extraNodeModules: {
            nodeLibs,
            'node:crypto': require.resolve('expo-crypto'),
            ...config.resolver.extraNodeModules,
        },
    },
};