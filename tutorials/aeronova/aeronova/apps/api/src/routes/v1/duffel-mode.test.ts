import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { offerRequestResponse } from '../../providers/flight/duffel/__fixtures__/offer-request.js';
import { buildTestApp } from '../../test-support.js';

const env = { APP_MODE: 'test', FLIGHT_PROVIDER: 'duffel', DUFFEL_ACCESS_TOKEN: 'duffel_test_TOKEN_XYZ' };

const body = {
  tripType: 'one_way',
  cabin: 'economy',
  passengers: { adults: 1, children: 0, infants: 0 },
  journeys: [{ origin: 'LHR', destination: 'JFK', departureDate: '2026-12-20' }],
};

afterEach(() => vi.unstubAllGlobals());

describe('API in Duffel sandbox mode', () => {
  it('searches through Duffel and returns sandbox-labelled, supplier-neutral results', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify(offerRequestResponse), {
          headers: { 'content-type': 'application/json' },
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { app, logs } = buildTestApp(env);

    const res = await request(app).post('/api/v1/search/flights').send(body).expect(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(res.body.data.dataOrigin).toBe('sandbox');
    expect(res.body.data.currency).toBe('USD');
    expect(res.body.data.conversion).toBe('demo_rates');
    expect(res.body.data.offers).toHaveLength(3);
    // "Duffel Airways" is the sandbox's fictional carrier: legitimate flight data.
    const text = JSON.stringify(res.body).replaceAll('Duffel Airways', '');
    expect(text).not.toMatch(/off_direct|off_connecting|orq_test|duffel/i);
    expect(JSON.stringify(logs.lines)).not.toContain('TOKEN_XYZ');
  });

  it('does not fan out nearby-date searches to a metered supplier', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { app } = buildTestApp(env);
    const res = await request(app).post('/api/v1/search/flexible').send(body).expect(200);
    expect(res.body.data).toEqual({ supported: false, currency: 'USD', dataOrigin: null, cells: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports a supplier outage without leaking details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('upstream exploded: secret stack', { status: 500 })),
    );
    const { app } = buildTestApp(env);
    const res = await request(app).post('/api/v1/search/flights').send(body).expect(502);
    expect(res.body.error.code).toBe('FLIGHT_PROVIDER_UNAVAILABLE');
    expect(JSON.stringify(res.body)).not.toMatch(/exploded|duffel/i);
  });
});
