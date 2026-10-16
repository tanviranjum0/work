import request from 'supertest';
import type { Express } from 'express';
import { describe, expect, it } from 'vitest';
import { buildTestApp } from '../../test-support.js';

const ADMIN_EMAIL = 'boss@example.com';

const searchBody = {
  tripType: 'one_way',
  cabin: 'economy',
  passengers: { adults: 1, children: 0, infants: 0 },
  journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-22' }],
};

const bookingBody = (quoteId: string) => ({
  quoteId,
  passengers: [
    { type: 'adult', givenName: 'Tanvir', familyName: 'Anjum', dateOfBirth: '1995-03-14', nationality: 'BD' },
  ],
  contact: { email: 'tanvir@example.com', phone: '+8801700000000' },
  payment: { method: 'demo_card', holderName: 'Tanvir Anjum' },
  acceptedTerms: true,
});

const signUp = async (app: Express, email: string) => {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email, password: 'a-long-enough-password' })
    .expect(201);
  return { token: `Bearer ${res.body.data.accessToken as string}`, user: res.body.data.user };
};

const bookFor = async (app: Express, token: string, key: string) => {
  const search = await request(app).post('/api/v1/search/flights').send(searchBody).expect(200);
  const offerId = search.body.data.offers[0].offer.id as string;
  const quote = await request(app)
    .post('/api/v1/offers/price')
    .set('Authorization', token)
    .send({ searchId: search.body.data.searchId, offerId })
    .expect(200);
  const res = await request(app)
    .post('/api/v1/bookings')
    .set({ Authorization: token, 'Idempotency-Key': `idem-${key}-${'0'.repeat(12)}` })
    .send(bookingBody(quote.body.data.quoteId))
    .expect(201);
  return res.body.data.reference as string;
};

describe('admin routes', () => {
  it('grants ADMIN only to the configured demo email, and only USER to everyone else', async () => {
    const { app } = buildTestApp({ DEMO_ADMIN_EMAIL: ADMIN_EMAIL });
    const admin = await signUp(app, ADMIN_EMAIL);
    const regular = await signUp(app, 'nobody@example.com');
    expect(admin.user.roles).toEqual(['ADMIN']);
    expect(regular.user.roles).toEqual(['USER']);
  });

  it('refuses admin endpoints to signed-out and non-admin callers, but not with a 500', async () => {
    const { app } = buildTestApp({ DEMO_ADMIN_EMAIL: ADMIN_EMAIL });
    const regular = await signUp(app, 'plain@example.com');
    await request(app).get('/api/v1/admin/metrics').expect(401);
    const res = await request(app)
      .get('/api/v1/admin/metrics')
      .set('Authorization', regular.token)
      .expect(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it("sees every user's bookings and users, not just its own", async () => {
    const { app } = buildTestApp({ DEMO_ADMIN_EMAIL: ADMIN_EMAIL });
    const admin = await signUp(app, ADMIN_EMAIL);
    const alice = await signUp(app, 'alice@example.com');
    const bob = await signUp(app, 'bob@example.com');
    const aliceRef = await bookFor(app, alice.token, 'alice');
    const bobRef = await bookFor(app, bob.token, 'bob');

    const users = await request(app).get('/api/v1/admin/users').set('Authorization', admin.token).expect(200);
    const emails = users.body.data.map((u: { email: string }) => u.email);
    expect(emails).toEqual(expect.arrayContaining([ADMIN_EMAIL, 'alice@example.com', 'bob@example.com']));
    expect(users.body.data.every((u: Record<string, unknown>) => !('passwordHash' in u))).toBe(true);

    const bookings = await request(app)
      .get('/api/v1/admin/bookings')
      .set('Authorization', admin.token)
      .expect(200);
    const refs = bookings.body.data.map((b: { reference: string }) => b.reference);
    expect(refs).toEqual(expect.arrayContaining([aliceRef, bobRef]));

    // Neither Alice nor Bob's own booking endpoint can see the other's reference.
    await request(app).get(`/api/v1/bookings/${bobRef}`).set('Authorization', alice.token).expect(404);

    const single = await request(app)
      .get(`/api/v1/admin/bookings/${aliceRef}`)
      .set('Authorization', admin.token)
      .expect(200);
    expect(single.body.data.reference).toBe(aliceRef);
    await request(app).get('/api/v1/admin/bookings/ZZZZZZ').set('Authorization', admin.token).expect(404);
  });

  it('filters bookings by state and reports metrics without mixing currencies', async () => {
    const { app } = buildTestApp({ DEMO_ADMIN_EMAIL: ADMIN_EMAIL });
    const admin = await signUp(app, ADMIN_EMAIL);
    const traveller = await signUp(app, 'traveller@example.com');
    await bookFor(app, traveller.token, 'metrics');

    const metrics = await request(app)
      .get('/api/v1/admin/metrics')
      .set('Authorization', admin.token)
      .expect(200);
    expect(metrics.body.data.totalUsers).toBeGreaterThanOrEqual(2);
    expect(metrics.body.data.bookingsByState.TICKETED).toBeGreaterThanOrEqual(1);
    expect(metrics.body.data.bookingTotalsByCurrency).toHaveProperty('USD');
    expect(typeof metrics.body.data.bookingTotalsByCurrency.USD).toBe('number');

    const ticketed = await request(app)
      .get('/api/v1/admin/bookings')
      .query({ state: 'TICKETED' })
      .set('Authorization', admin.token)
      .expect(200);
    expect(ticketed.body.data.every((b: { state: string }) => b.state === 'TICKETED')).toBe(true);

    await request(app)
      .get('/api/v1/admin/bookings')
      .query({ state: 'not-a-state' })
      .set('Authorization', admin.token)
      .expect(400);
  });

  it('reports provider status without ever including a secret', async () => {
    const { app } = buildTestApp({ DEMO_ADMIN_EMAIL: ADMIN_EMAIL, DUFFEL_ACCESS_TOKEN: '' });
    const admin = await signUp(app, ADMIN_EMAIL);
    const res = await request(app)
      .get('/api/v1/admin/provider-status')
      .set('Authorization', admin.token)
      .expect(200);
    expect(res.body.data).toMatchObject({ appMode: 'demo', flightProvider: 'mock', authProvider: 'dev' });
    expect(JSON.stringify(res.body)).not.toMatch(/duffel_(test|live)_/);
    expect(res.body.data).not.toHaveProperty('secrets');
    expect(res.body.data).not.toHaveProperty('devSecret');
  });

  it('records and lists real audit events: registration, sign-in, a failed attempt and a booking', async () => {
    const { app } = buildTestApp({ DEMO_ADMIN_EMAIL: ADMIN_EMAIL });
    const admin = await signUp(app, ADMIN_EMAIL);
    const traveller = await signUp(app, 'audited@example.com');
    await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'audited@example.com', password: 'wrong-but-long-enough' })
      .expect(401);
    const ref = await bookFor(app, traveller.token, 'audit');

    const log = await request(app)
      .get('/api/v1/admin/audit-log')
      .set('Authorization', admin.token)
      .expect(200);
    const types = log.body.data.map((e: { type: string }) => e.type);
    expect(types).toEqual(expect.arrayContaining(['USER_REGISTERED', 'LOGIN_FAILED', 'BOOKING_CREATED']));
    const bookingEvent = log.body.data.find(
      (e: { type: string; context: { reference?: string } }) =>
        e.type === 'BOOKING_CREATED' && e.context.reference === ref,
    );
    expect(bookingEvent).toMatchObject({ actorEmail: 'audited@example.com' });
    const failed = log.body.data.find((e: { type: string }) => e.type === 'LOGIN_FAILED');
    expect(failed).toMatchObject({ actorEmail: 'audited@example.com' });
    // The failed attempt's password must never appear anywhere in the log.
    expect(JSON.stringify(log.body)).not.toContain('wrong-but-long-enough');

    const onlyFailed = await request(app)
      .get('/api/v1/admin/audit-log')
      .query({ type: 'LOGIN_FAILED' })
      .set('Authorization', admin.token)
      .expect(200);
    expect(onlyFailed.body.data.every((e: { type: string }) => e.type === 'LOGIN_FAILED')).toBe(true);
  });

  it('never lets a demo admin email work in production', async () => {
    expect(() =>
      // Reuse the production-shaped config directly to prove the rule.
      buildTestApp({
        NODE_ENV: 'production',
        APP_MODE: 'production',
        FLIGHT_PROVIDER: 'duffel',
        DUFFEL_ACCESS_TOKEN: 'duffel_live_x',
        MONGODB_URI: 'mongodb+srv://cluster.example.net/aeronova',
        CORS_ORIGINS: 'https://example.com',
        DEMO_ADMIN_EMAIL: ADMIN_EMAIL,
      }),
    ).toThrow(/must not be set in production/);
  });
});
