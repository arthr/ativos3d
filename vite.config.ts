import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
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
