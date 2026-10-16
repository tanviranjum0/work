import { defineConfig } from 'vitest/config';

// Root test runner: each workspace declares its own project so environments
// (node for api/shared, jsdom for web) never leak into each other.
export default defineConfig({
  test: {
    projects: ['packages/shared', 'apps/api', 'apps/web'],
  },
});
