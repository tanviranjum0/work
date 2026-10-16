import type { Logger } from 'pino';
import { pinoHttp } from 'pino-http';
import type { RequestHandler } from 'express';

/**
 * Access log with a deliberately small request shape: method, route path and
 * status only. Query strings are dropped because search URLs can carry
 * traveller-entered text.
 */
export const httpLogger = (logger: Logger): RequestHandler =>
  pinoHttp({
    logger,
    genReqId: (req) => (req as unknown as { requestId?: string }).requestId ?? 'unknown',
    customLogLevel: (_req, res, err) =>
      err || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
    customSuccessMessage: (req, res, ms) => `${req.method} ${res.statusCode} ${Math.round(ms)}ms`,
    customErrorMessage: (req, res) => `${req.method} ${res.statusCode} failed`,
    serializers: {
      req: (req: { method: string; url: string }) => ({ method: req.method, path: req.url.split('?')[0] }),
      res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
    },
    autoLogging: { ignore: (req) => req.url?.startsWith('/health/live') ?? false },
  });
