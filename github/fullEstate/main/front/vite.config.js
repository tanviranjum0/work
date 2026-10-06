import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const configDirectory = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, configDirectory, "");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: environment.VITE_API_TARGET || "http://localhost:4000",
          changeOrigin: true,
        },
      },
    },
  };
});
