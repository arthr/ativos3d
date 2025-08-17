import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./tests/setup.ts"],
        include: [
            "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
            "tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
        ],
        exclude: ["node_modules/", "tests/", "legacy/", "dist/", "**/*.d.ts", "**/*.config.*"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html", "lcov"],
            exclude: [
                "node_modules/",
                "tests/",
                "legacy/",
                "dist/",
                "**/*.d.ts",
                "**/*.config.*",
                "**/*.test.*",
                "**/*.spec.*",
            ],
            thresholds: {
                global: {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80,
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "@core": resolve(__dirname, "./src/core"),
            "@domain": resolve(__dirname, "./src/domain"),
            "@infrastructure": resolve(__dirname, "./src/infrastructure"),
            "@application": resolve(__dirname, "./src/application"),
            "@presentation": resolve(__dirname, "./src/presentation"),
            "@shared": resolve(__dirname, "./src/shared"),
        },
    },
});
