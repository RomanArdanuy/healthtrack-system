const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Paquetes compartidos
const extraNodeModules = {
    "@healthtrack/ui": path.resolve(__dirname, "../../../packages/ui"),
    "@healthtrack/api": path.resolve(__dirname, "../../../packages/api"),
    "@healthtrack/auth": path.resolve(__dirname, "../../../packages/auth"),
    "@healthtrack/types": path.resolve(__dirname, "../../../packages/types"),
};

config.resolver.extraNodeModules = new Proxy(extraNodeModules, {
    get: (target, name) =>
        name in target ? target[name] : path.join(process.cwd(), "node_modules", name),
});

config.watchFolders = [
    path.resolve(__dirname, "../../../packages/ui"),
    path.resolve(__dirname, "../../../packages/api"),
    path.resolve(__dirname, "../../../packages/auth"),
    path.resolve(__dirname, "../../../packages/types"),
];

// Eliminar la referencia a NativeWind y sus transformadores
// config.transformer = {
//     ...config.transformer,
//     babelTransformerPath: require.resolve("metro-react-native-babel-transformer"),
//     getCustomTransformers: () => ({
//         before: [
//             require("nativewind/babel"),
//         ],
//     }),
// };

module.exports = config;