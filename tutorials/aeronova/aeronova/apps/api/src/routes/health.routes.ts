import { Router } from 'express';
import type { HealthCheckResult, HealthStatus } from '@aeronova/shared';
import type { AppConfig } from '../config/env.js';
import { sendSuccess } from '../http/respond.js';
import { APP_VERSION } from '../version.js';

/** A readiness check must be cheap and must never throw raw errors outward. */
export type ReadinessCheck = () => Promise<HealthCheckResult>;

export const healthRoutes = (config: AppConfig, checks: Readonly<Record<string, ReadinessCheck>>): Router => {
  const router = Router();
  const base = { mode: config.appMode, version: APP_VERSION } as const;

  router.get('/', (_req, res) => sendSuccess<HealthStatus>(res, { status: 'ok', ...base }));
  router.get('/live', (_req, res) => sendSuccess<HealthStatus>(res, { status: 'ok', ...base }));

  router.get('/ready', async (_req, res) => {
    const entries = await Promise.all(
      Object.entries(checks).map(async ([name, check]) => {
        const result = await Promise.race([
          check().catch((): HealthCheckResult => 'failed'),
          new Promise<HealthCheckResult>((resolve) => setTimeout(() => resolve('failed'), 2_000).unref()),
        ]);
        return [name, result] as const;
      }),
    );
    const results = Object.fromEntries(entries);
    const failed = entries.some(([, r]) => r === 'failed');
    const body: HealthStatus = { status: failed ? 'unavailable' : 'ok', ...base, checks: results };
    sendSuccess(res, body, failed ? 503 : 200);
  });

  return router;
};
