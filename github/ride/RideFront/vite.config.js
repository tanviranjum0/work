import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const vendorChunks = {
  react: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
  motion: /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
  maplibre: /[\\/]node_modules[\\/]maplibre-gl[\\/]/,
  socket: /[\\/]node_modules[\\/](socket\.io-client|socket\.io-parser|engine\.io-client|engine\.io-parser|@socket\.io)[\\/]/,
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Stable vendor chunks stay cached across app deploys (assets are served immutable).
        manualChunks(id) {
          for (const [name, pattern] of Object.entries(vendorChunks)) {
            if (pattern.test(id)) return name
          }
        },
      },
    },
  },
  // Strip debug logging from production bundles; console.error/warn are kept.
  esbuild: mode === 'production' ? { pure: ['console.log', 'console.debug', 'console.info'] } : {},
}))
