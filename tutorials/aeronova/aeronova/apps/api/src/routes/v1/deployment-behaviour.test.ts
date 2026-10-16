import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { loadConfig } from '../../config/env.js';
import { buildTestApp } from '../../test-support.js';

describe('booking is only what it claims to be', () => {
  it('does not mount booking routes at all when booking is disabled', async () => {
    const { app } = buildTestApp({ FEATURE_BOOKING: 'false' });
    await request(app).get('/api/v1/bookings').expect(404);
  });

  it('refuses a Duffel booking provider, which is not implemented and would silently book through the simulator', () => {
    expect(() =>
      loadConfig({
        APP_MODE: 'test',
        FLIGHT_PROVIDER: 'duffel',
        BOOKING_PROVIDER: 'duffel',
        DUFFEL_ACCESS_TOKEN: 'duffel_test_x',
      }),
    ).toThrow(/BOOKING_PROVIDER: Duffel orders are not implemented/);
  });

  it('refuses simulated booking of real supplier offers, and turns booking off by default for them', () => {
    const sandbox = {
      APP_MODE: 'test',
      FLIGHT_PROVIDER: 'duffel',
      DUFFEL_ACCESS_TOKEN: 'duffel_test_x',
    } as const;
    expect(() => loadConfig({ ...sandbox, FEATURE_BOOKING: 'true' })).toThrow(
      /Simulated booking only works with simulated flights/,
    );
    expect(loadConfig(sandbox).features.booking).toBe(false);
    expect(loadConfig({}).features.booking).toBe(true); // demo: simulated flights, simulated booking
  });
});

describe('client config', () => {
  it('tells the web app to use the built-in sign-in in demo mode', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/api/v1/client-config').expect(200);
    expect(res.body.data).toEqual({
      appMode: 'demo',
      features: { booking: true },
    });
  });
});
