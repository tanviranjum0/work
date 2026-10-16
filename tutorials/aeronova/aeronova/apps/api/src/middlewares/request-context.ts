import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { runWithRequestContext } from '../observability/request-context.js';

// Accept caller-supplied IDs only if they look like IDs, so logs can't be polluted.
const SAFE_ID = /^[A-Za-z0-9._:-]{8,128}$/;

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string;
  }
}

export const requestContext = (): RequestHandler => (req, res, next) => {
  const incoming = req.get('x-request-id');
  const requestId = incoming && SAFE_ID.test(incoming) ? incoming : randomUUID();
  const trace = req.get('x-correlation-id') ?? req.get('x-amzn-trace-id');
  const correlationId = trace && SAFE_ID.test(trace) ? trace : requestId;

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  runWithRequestContext({ requestId, correlationId }, () => next());
};
