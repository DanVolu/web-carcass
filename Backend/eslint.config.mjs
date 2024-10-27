import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

import pkg from "@eslint/js";
const { configs: eslintRecommended } = pkg;

import prettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  eslintRecommended.recommended,

  prettierRecommended,

  eslintConfigPrettier,

  {
    files: ["**/*.{js,mjs,cjs,ts,}",],

    plugins: {
      prettier: eslintPluginPrettier,
    },

    languageOptions: {
      globals: {
        console: "readonly",
      },
    },

    env: {
      node: true,
    },

    rules: {
      "prettier/prettier": "error",

      "no-console": "off",

      eqeqeq: "error",

      curly: "error",

      "comma-dangle": ["error", "always-multiline"],

      "comma-spacing": ["error", { before: false, after: true }],

      "comma-style": ["error", "last"],

      indent: ["error", 2],

      quotes: ["error", "double"],

      semi: ["error", "always"],

      "object-curly-spacing": ["error", "always"],
    },
  },
  ...tseslint.configs.recommended,
];
