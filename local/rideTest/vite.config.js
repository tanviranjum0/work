import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  server: {
    allowedHosts: true,
  },
  plugins: [tailwindcss(), react()],
});
