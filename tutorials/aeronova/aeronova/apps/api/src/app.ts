import express, { type Express } from 'express';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Logger } from 'pino';
import type { AppConfig } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { httpLogger } from './middlewares/http-logger.js';
import { requestContext } from './middlewares/request-context.js';
import { corsPolicy, permissionsPolicy, securityHeaders } from './middlewares/security.js';
import { healthRoutes, type ReadinessCheck } from './routes/health.routes.js';
import { apiV1Routes, type ApiV1Services } from './routes/index.js';
import { AppError } from './errors/app-error.js';
import { ERROR_CODES } from '@aeronova/shared';

export interface AppDependencies {
  /** Resolves once storage can serve requests (MongoDB connected and indexed); immediate without a database. */
  readonly ready: () => Promise<void>;
  readonly config: AppConfig;
  readonly logger: Logger;
  readonly readinessChecks: Readonly<Record<string, ReadinessCheck>>;
  readonly services: ApiV1Services;
}

/**
 * Pure factory: no listening, no I/O, no process globals. The same app is
 * served by `server.ts` locally and in hosted environments.
 */
export const createApp = (deps: AppDependencies): Express => {
  const { config, logger } = deps;
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', config.http.trustProxyHops);
  app.set('query parser', 'simple'); // no nested objects from query strings

  app.use(requestContext());
  app.use(httpLogger(logger));
  app.use(securityHeaders(config));
  app.use(permissionsPolicy());
  app.use(corsPolicy(config));
  app.use(express.json({ limit: config.http.bodyLimit, strict: true, type: 'application/json' }));

  app.use('/health', healthRoutes(config, deps.readinessChecks));
  // No API work before storage is ready (a no-op without a database).
  app.use('/api/v1', (_req, _res, next) => {
    deps.ready().then(
      () => next(),
      () =>
        next(
          new AppError(
            ERROR_CODES.SERVICE_UNAVAILABLE,
            503,
            'The service is starting up. Try again in a moment.',
          ),
        ),
    );
  });
  app.use('/api/v1', apiV1Routes(deps.services));

  // Render builds both workspaces from the repository root, then starts this
  // workspace from apps/api. Resolve the same web build from either cwd.
  const webDistCandidates = [
    process.env.AERONOVA_WEB_DIST,
    resolve(process.cwd(), 'apps/web/dist'),
    resolve(process.cwd(), '../../apps/web/dist'),
  ].filter((candidate): candidate is string => Boolean(candidate));
  const webDist = webDistCandidates.find((candidate) => existsSync(resolve(candidate, 'index.html')));
  if (webDist) {
    app.use(express.static(webDist, { index: false, fallthrough: true }));
    app.get('/{*path}', (req, res, next) => {
      if (req.path === '/api' || req.path.startsWith('/api/') || req.path === '/health' || req.path.startsWith('/health/')) {
        next();
        return;
      }
      res.sendFile(resolve(webDist, 'index.html'), (err) => {
        if (err) next(err);
      });
    });
  }

  app.use(notFoundHandler());
  app.use(errorHandler(logger));
  return app;
};
