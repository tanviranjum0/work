import { describe, expect, it, vi } from 'vitest';
import { ApiClientError, createApiClient } from './api-client';

const jsonResponse = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });

describe('api client', () => {
  it('unwraps the success envelope and never sends cookies', async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ success: true, data: { status: 'ok', mode: 'demo', version: 'dev' } }),
    );
    const client = createApiClient(fetchMock, '');
    await expect(client.getHealth()).resolves.toEqual({ status: 'ok', mode: 'demo', version: 'dev' });
    expect(fetchMock.mock.calls[0]?.[1]?.credentials).toBe('omit');
  });

  it('turns an error envelope into a typed error with the support reference', async () => {
    const client = createApiClient(
      async () =>
        jsonResponse(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Some details need attention.',
              requestId: 'req-123',
              issues: [{ path: 'journeys.0.origin', message: 'Use a 3-letter airport code, e.g. DAC.' }],
            },
          },
          400,
        ),
      '',
    );
    const err = await client.request('/api/v1/x').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiClientError);
    expect(err).toMatchObject({ code: 'VALIDATION_ERROR', status: 400, requestId: 'req-123' });
    expect((err as ApiClientError).issues).toHaveLength(1);
    expect((err as ApiClientError).isTransient).toBe(false);
  });

  it('classifies network failures as transient and non-JSON as unexpected', async () => {
    const offline = createApiClient(async () => {
      throw new TypeError('Failed to fetch');
    }, '');
    await expect(offline.request('/health')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      isTransient: true,
    });

    const html = createApiClient(async () => new Response('<html>502</html>', { status: 502 }), '');
    await expect(html.request('/health')).rejects.toMatchObject({ code: 'UNEXPECTED_RESPONSE', status: 502 });
  });

  it('sends idempotency keys and bearer tokens only when given', async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ success: true, data: {} }),
    );
    const client = createApiClient(fetchMock, 'https://api.example');
    client.useTokenSource(() => 't');
    await client.request('/api/v1/bookings', {
      method: 'POST',
      body: { a: 1 },
      idempotencyKey: 'k-1',
    });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('https://api.example/api/v1/bookings');
    expect(init?.headers).toMatchObject({
      'Idempotency-Key': 'k-1',
      Authorization: 'Bearer t',
      'Content-Type': 'application/json',
    });
  });
});
