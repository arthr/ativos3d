module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    env: {
        browser: true,
        es2022: true,
        node: true,
    },
    plugins: ["@typescript-eslint", "react", "react-hooks"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
    ],
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        // TypeScript
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-unused-params": "error",
        "@typescript-eslint/prefer-const": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/explicit-module-boundary-types": "warn",

        // React
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",

        // Geral
        "no-console": "warn",
        "no-debugger": "error",
        "prefer-const": "error",
        "no-var": "error",
    },
    ignorePatterns: [
        "dist/**",
        "node_modules/**",
        "legacy/**",
        "*.config.js",
        "*.config.ts",
        "vitest.config.ts",
        "playwright.config.ts",
    ],
};
