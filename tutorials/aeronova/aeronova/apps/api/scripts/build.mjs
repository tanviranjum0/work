// Bundles the API into a self-contained CommonJS entrypoint for Node hosting.
// Bundling keeps cold starts small and inlines @aeronova/shared (shipped as TS source).
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';

await rm(new URL('../dist', import.meta.url), { recursive: true, force: true });

await build({
  entryPoints: { server: 'src/server.ts' },
  outdir: 'dist',
  outExtension: { '.js': '.cjs' },
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  sourcemap: 'linked',
  minify: true,
  keepNames: true,
  legalComments: 'external',
  metafile: false,
  logLevel: 'info',
  // pdfkit resolves its bundled resources (standard font metrics, an ICC colour
  // profile) with paths relative to its own package location; inlining it into
  // one file breaks that resolution (confirmed: `new URL('./data/...')` throws
  // ERR_INVALID_URL once concatenated). It must stay a real require() against
  // node_modules at runtime, so the deployment package needs `node_modules/pdfkit`
  // alongside dist/ — see docs/ARCHITECTURE.md and docs/VERCEL_RENDER_DEPLOYMENT_GUIDE.md.
  external: ['pdfkit'],
});
