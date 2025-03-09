const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Paquetes compartidos
const extraNodeModules = {
    "@healthtrack/ui": path.resolve(__dirname, "../../../packages/ui"),
    "@healthtrack/api": path.resolve(__dirname, "../../../packages/api"),
    "nativewind": path.resolve(__dirname, "node_modules/nativewind"),
};

config.resolver.extraNodeModules = new Proxy(extraNodeModules, {
    get: (target, name) =>
        name in target ? target[name] : path.join(process.cwd(), "node_modules", name),
});

config.watchFolders = [
    path.resolve(__dirname, "../../../packages/ui"),
    path.resolve(__dirname, "../../../packages/api"),
];

// Configuración de NativeWind
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("metro-react-native-babel-transformer"),
    getCustomTransformers: () => ({
        before: [
            require("nativewind/babel"),
        ],
    }),
};

module.exports = config;