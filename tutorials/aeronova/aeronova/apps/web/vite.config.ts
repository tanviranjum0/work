import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The dev proxy mirrors the API paths used by the hosted web app.
const API_TARGET = process.env.AERONOVA_API_PROXY ?? 'http://localhost:4000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: false },
      '/health': { target: API_TARGET, changeOrigin: false },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: 'hidden',
    reportCompressedSize: true,
    rolldownOptions: {
      output: {
        // Framework code changes far less often than app code, so it gets its own
        // long-cached file and survives most deploys without a re-download.
        codeSplitting: {
          groups: [
            {
              name: 'framework',
              test: /node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/,
              priority: 20,
            },
            // Validation (zod) is excluded so it follows its lazy importers instead of loading on first paint.
            { name: 'vendor', test: /node_modules[\\/](?!zod[\\/])/, priority: 10 },
          ],
        },
      },
    },
  },
});
