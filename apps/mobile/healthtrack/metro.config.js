const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Si tienes más paquetes compartidos, añádelos aquí.
const extraNodeModules = {
    "@healthtrack/ui": path.resolve(__dirname, "../../../packages/ui"),
    "@healthtrack/api": path.resolve(__dirname, "../../../packages/api"),
};

config.resolver.extraNodeModules = new Proxy(extraNodeModules, {
    get: (target, name) =>
        name in target ? target[name] : path.join(process.cwd(), "node_modules", name),
});

config.watchFolders = [
    path.resolve(__dirname, "../../../packages/ui"),
    path.resolve(__dirname, "../../../packages/api"),
];

module.exports = config;
