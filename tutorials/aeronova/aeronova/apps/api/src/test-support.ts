import { Writable } from 'node:stream';
import { createApp, type AppDependencies } from './app.js';
import { buildDependencies } from './container.js';
import { loadConfig } from './config/env.js';
import { createLogger } from './observability/logger.js';

/** Captures JSON log lines so tests can assert on what was (and wasn't) logged. */
export const memoryLogStream = () => {
  const lines: Record<string, unknown>[] = [];
  const stream = new Writable({
    write(chunk: Buffer, _enc, cb) {
      for (const line of chunk.toString().split('\n').filter(Boolean))
        lines.push(JSON.parse(line) as Record<string, unknown>);
      cb();
    },
  });
  return { lines, stream };
};

export const buildTestApp = (env: Record<string, string> = {}, overrides: Partial<AppDependencies> = {}) => {
  const config = loadConfig({ NODE_ENV: 'test', APP_MODE: 'demo', ...env });
  const logs = memoryLogStream();
  const logger = createLogger({ level: 'debug' }, logs.stream);
  const base = buildDependencies(config, logger);
  const app = createApp({ ...base, readinessChecks: {}, ...overrides });
  return { app, config, logs };
};
