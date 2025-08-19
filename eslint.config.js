import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2023,
                sourceType: "module",
                project: "./tsconfig.json",
            },
            globals: {
                console: "readonly",
                setTimeout: "readonly",
                crypto: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": typescript,
            react,
            "react-hooks": reactHooks,
        },
        rules: {
            // TypeScript
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/explicit-module-boundary-types": "warn",

            // React
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // Geral
            "no-unused-vars": "warn",
            "no-console": "warn",
            "no-debugger": "error",
            "prefer-const": "error",
            "no-var": "error",
        },
    },
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "legacy/**",
            "*.config.js",
            "*.config.ts",
            "vitest.config.ts",
            "playwright.config.ts",
        ],
    },
    prettier,
];
