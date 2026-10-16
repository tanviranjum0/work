import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { errorHandler } from './middlewares/error-handler.js';
import { requestContext } from './middlewares/request-context.js';
import { createLogger } from './observability/logger.js';
import { buildTestApp, memoryLogStream } from './test-support.js';

describe('HTTP foundation', () => {
  it('reports liveness without leaking configuration', async () => {
    const { app } = buildTestApp({ DUFFEL_ACCESS_TOKEN: 'duffel_test_hidden' });
    const res = await request(app).get('/health').expect(200);
    expect(res.body).toEqual({ success: true, data: { status: 'ok', mode: 'demo', version: 'dev' } });
    expect(JSON.stringify(res.body)).not.toContain('hidden');
  });

  it('returns 503 when a readiness check fails, and times out slow checks', async () => {
    const { app } = buildTestApp(
      {},
      { readinessChecks: { database: () => Promise.reject(new Error('down')), cache: async () => 'ok' } },
    );
    const res = await request(app).get('/health/ready').expect(503);
    expect(res.body.data.checks).toEqual({ database: 'failed', cache: 'ok' });
  });

  it('returns a stable envelope with a request id for unknown routes', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/api/v1/nope').expect(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.requestId).toBe(res.headers['x-request-id']);
  });

  it('propagates a well-formed caller request id and replaces a malformed one', async () => {
    const { app } = buildTestApp();
    const ok = await request(app).get('/health').set('X-Request-Id', 'client-req-12345');
    expect(ok.headers['x-request-id']).toBe('client-req-12345');
    const bad = await request(app).get('/health').set('X-Request-Id', '<script>alert(1)</script> spaced id');
    expect(bad.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('rejects malformed JSON and oversized bodies with specific codes', async () => {
    const { app } = buildTestApp({ REQUEST_BODY_LIMIT: '1kb' });
    const malformed = await request(app)
      .post('/api/v1/anything')
      .set('Content-Type', 'application/json')
      .send('{"a":');
    expect(malformed.status).toBe(400);
    expect(malformed.body.error.code).toBe('VALIDATION_ERROR');

    const big = await request(app)
      .post('/api/v1/anything')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ q: 'x'.repeat(4096) }));
    expect(big.status).toBe(413);
    expect(big.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('sets strict security headers and hides the framework', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['content-security-policy']).toContain("default-src 'none'");
    expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['referrer-policy']).toBe('no-referrer');
    expect(res.headers['permissions-policy']).toContain('geolocation=()');
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('only grants CORS to allowlisted origins', async () => {
    const { app } = buildTestApp();
    const allowed = await request(app).get('/health').set('Origin', 'http://localhost:5173');
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    const denied = await request(app).get('/health').set('Origin', 'https://evil.example');
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('hides internal error details from clients but logs them with the request id', async () => {
    const { lines, stream } = memoryLogStream();
    const probe = express();
    probe.use(requestContext());
    probe.get('/boom', () => {
      throw new Error('mongo password=hunter2 at line 42');
    });
    probe.use(errorHandler(createLogger({ level: 'debug' }, stream)));

    const res = await request(probe).get('/boom').expect(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(JSON.stringify(res.body)).not.toContain('hunter2');
    expect(res.body.error).not.toHaveProperty('stack');
    const errorLine = lines.find((l) => l.level === 'error');
    expect(errorLine?.requestId).toBe(res.headers['x-request-id']);
  });
});
