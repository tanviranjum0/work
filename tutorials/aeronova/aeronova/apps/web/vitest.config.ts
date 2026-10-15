import { defineProject } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const rrRoot = dirname(createRequire(import.meta.url).resolve('react-router/package.json'));
const rr = (file: string) => join(rrRoot, 'dist/development', file);

export default defineProject({
  plugins: [react()],
  resolve: {
    // Under Node, 'react-router' and 'react-router/dom' can resolve to different builds
    // (CJS vs ESM) that don't share a router context. Pin both to the ESM build.
    alias: [
      { find: /^react-router\/dom$/, replacement: rr('dom-export.mjs') },
      { find: /^react-router$/, replacement: rr('index.mjs') },
    ],
  },
  test: {
    name: 'web',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
    server: { deps: { inline: [/react-router/] } },
  },
});
