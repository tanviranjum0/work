import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createApp } from './app.js';
import { ConfigError, loadConfig } from './config/env.js';
import { buildDependencies } from './container.js';

// Local convenience only. Deployed environments inject real environment variables.
for (const file of ['.env.local', '.env']) {
  const path = resolve(process.cwd(), file);
  if (existsSync(path)) {
    process.loadEnvFile(path);
    break;
  }
}

const main = (): void => {
  const config = loadConfig(process.env);
  const deps = buildDependencies(config);
  const server = createApp(deps).listen(config.port, () => {
    deps.logger.info(
      { port: config.port, mode: config.appMode, flightProvider: config.providers.flight },
      'API listening',
    );
  });

  const shutdown = (signal: string): void => {
    deps.logger.info({ signal }, 'shutting down');
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

try {
  main();
} catch (err) {
  if (err instanceof ConfigError) {
    process.stderr.write(`${err.message}\n\nSee apps/api/.env.example.\n`);
    process.exit(1);
  }
  throw err;
}
