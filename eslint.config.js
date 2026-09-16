const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: [
      ".agents/**",
      ".expo/**",
      ".kilo/**",
      "coverage/**",
      "dist/**",
      "node_modules/**",
      "openspec/**",
      "static-build/**",
    ],
  },
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: ["scripts/**/*.js", "server/**/*.js"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        Buffer: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
      },
    },
  },
]);
