import request from 'supertest';
import type { Express } from 'express';
import { describe, expect, it } from 'vitest';
import { buildTestApp } from '../../test-support.js';

const searchBody = {
  tripType: 'one_way',
  cabin: 'economy',
  passengers: { adults: 1, children: 0, infants: 0 },
  journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-22' }],
};

const passenger = (over: Record<string, unknown> = {}) => ({
  type: 'adult',
  givenName: 'Tanvir',
  familyName: 'Anjum',
  dateOfBirth: '1995-03-14',
  nationality: 'BD',
  ...over,
});

const bookingBody = (quoteId: string, over: Record<string, unknown> = {}) => ({
  quoteId,
  passengers: [passenger()],
  contact: { email: 'tanvir@example.com', phone: '+8801700000000' },
  payment: { method: 'demo_card', holderName: 'Tanvir Anjum' },
  acceptedTerms: true,
  ...over,
});

const signUp = async (app: Express, email: string) => {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email, password: 'a-long-enough-password' })
    .expect(201);
  return `Bearer ${res.body.data.accessToken as string}`;
};

/** Search, then price the first offer, returning a quote ready to book. */
const getQuote = async (app: Express, token: string) => {
  const search = await request(app).post('/api/v1/search/flights').send(searchBody).expect(200);
  const offerId = search.body.data.offers[0].offer.id as string;
  const quote = await request(app)
    .post('/api/v1/offers/price')
    .set('Authorization', token)
    .send({ searchId: search.body.data.searchId, offerId })
    .expect(200);
  return quote.body.data;
};

const key = (suffix: string) => `idem-${suffix}-${'0'.repeat(12)}`;

describe('bookings', () => {
  it('books a checked quote and labels the result as simulated', async () => {
    const { app } = buildTestApp();
    const token = await signUp(app, 'booker@example.com');
    const quote = await getQuote(app, token);

    const res = await request(app)
      .post('/api/v1/bookings')
      .set({ Authorization: token, 'Idempotency-Key': key('ok') })
      .send(bookingBody(quote.quoteId))
      .expect(201);

    const booking = res.body.data;
    expect(booking.state).toBe('TICKETED');
    expect(booking.simulated).toBe(true);
    expect(booking.reference).toMatch(/^[A-Z0-9]{6}$/);
    expect(booking.tickets).toHaveLength(1);
    expect(booking.tickets[0]).toMatchObject({ state: 'ISSUED', simulated: true });
    expect(booking.tickets[0].number).toMatch(/^DEMO-/);
    expect(booking.payment).toMatchObject({ state: 'CAPTURED', provider: 'mock' });
    // The itinerary is copied into the booking, so it survives the offer expiring.
    expect(booking.snapshot.offer.journeys[0].segments[0].origin.iataCode).toBe('DAC');
    expect(booking.snapshot.dataOrigin).toBe('demo');
    expect(booking.history.map((e: { state: string }) => e.state)).toEqual([
      'DRAFT',
      'PAYMENT_PENDING',
      'PAYMENT_AUTHORIZED',
      'BOOKING_CONFIRMED',
      'TICKETING_PENDING',
      'TICKETED',
    ]);
  });

  it('never books twice for the same idempotency key, and rejects a reused key with different details', async () => {
    const { app } = buildTestApp();
    const token = await signUp(app, 'double@example.com');
    const quote = await getQuote(app, token);
    const headers = { Authorization: token, 'Idempotency-Key': key('double') };

    const [first, second] = await Promise.all([
      request(app).post('/api/v1/bookings').set(headers).send(bookingBody(quote.quoteId)),
      request(app).post('/api/v1/bookings').set(headers).send(bookingBody(quote.quoteId)),
    ]);
    // One books. The other either replays that same booking (201) or reports it is
    // still in progress (409) — but it must never create a second trip.
    const succeeded = [first, second].filter((r) => r.status === 201);
    expect(succeeded.length).toBeGreaterThanOrEqual(1);
    for (const r of [first, second]) expect([201, 409]).toContain(r.status);
    const reference = succeeded[0]?.body.data.reference as string;
    for (const r of succeeded) expect(r.body.data.reference).toBe(reference);

    const replay = await request(app)
      .post('/api/v1/bookings')
      .set(headers)
      .send(bookingBody(quote.quoteId))
      .expect(201);
    expect(replay.body.data.reference).toBe(reference);

    const changed = await request(app)
      .post('/api/v1/bookings')
      .set(headers)
      .send(bookingBody(quote.quoteId, { passengers: [passenger({ familyName: 'Different' })] }))
      .expect(409);
    expect(changed.body.error.code).toBe('IDEMPOTENCY_CONFLICT');

    expect((await request(app).get('/api/v1/bookings').set('Authorization', token)).body.data).toHaveLength(
      1,
    );
  });

  it('requires an idempotency key at all', async () => {
    const { app } = buildTestApp();
    const token = await signUp(app, 'nokey@example.com');
    const quote = await getQuote(app, token);
    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', token)
      .send(bookingBody(quote.quoteId))
      .expect(400);
    expect(res.body.error.message).toMatch(/Idempotency-Key/);
  });

  it('declines payment without creating a trip, and takes no money on a provider outage', async () => {
    const { app } = buildTestApp();
    const token = await signUp(app, 'declined@example.com');
    const quote = await getQuote(app, token);

    const declined = await request(app)
      .post('/api/v1/bookings')
      .set({ Authorization: token, 'Idempotency-Key': key('declined') })
      .send(bookingBody(quote.quoteId, { payment: { method: 'demo_card', holderName: 'Declined Card' } }))
      .expect(402);
    expect(declined.body.error.code).toBe('PAYMENT_FAILED');

    const outage = await request(app)
      .post('/api/v1/bookings')
      .set({ Authorization: token, 'Idempotency-Key': key('outage') })
      .send(bookingBody(quote.quoteId, { payment: { method: 'demo_card', holderName: 'Error Card' } }))
      .expect(502);
    expect(outage.body.error.message).toMatch(/No money has been taken/);
    // Neither attempt leaves a trip the traveller could mistake for a booking.
    expect((await request(app).get('/api/v1/bookings').set('Authorization', token)).body.data).toEqual([]);
  });

  it('flags for reconciliation when payment succeeds but the airline does not', async () => {
    const { app } = buildTestApp();
    const token = await signUp(app, 'soldout@example.com');
    const quote = await getQuote(app, token);

    const res = await request(app)
      .post('/api/v1/bookings')
      .set({ Authorization: token, 'Idempotency-Key': key('soldout') })
      .send(bookingBody(quote.quoteId, { passengers: [passenger({ familyName: 'Soldout' })] }))
      .expect(502);
    expect(res.body.error.code).toBe('BOOKING_FAILED');
    expect(res.body.error.message).toMatch(/payment went through/i);

    const list = (await request(app).get('/api/v1/bookings').set('Authorization', token)).body.data;
    expect(list).toHaveLength(1);
    expect(list[0].state).toBe('PAYMENT_RECONCILIATION_REQUIRED');
    expect(list[0].payment.state).toBe('AUTHORIZED');
    expect(list[0].tickets).toEqual([]);
  });

  it('does the same when tickets cannot be issued for a confirmed reservation', async () => {
    const { app } = buildTestApp();
    const token = await signUp(app, 'noticket@example.com');
    const quote = await getQuote(app, token);
    await request(app)
      .post('/api/v1/bookings')
      .set({ Authorization: token, 'Idempotency-Key': key('noticket') })
      .send(bookingBody(quote.quoteId, { passengers: [passenger({ familyName: 'Noticket' })] }))
      .expect(502);

    const list = (await request(app).get('/api/v1/bookings').set('Authorization', token)).body.data;
    expect(list[0].state).toBe('PAYMENT_RECONCILIATION_REQUIRED');
    expect(list[0].history.map((e: { state: string }) => e.state)).toContain('BOOKING_CONFIRMED');
  });

  it('refuses an expired or unknown quote', async () => {
    const { app } = buildTestApp();
    const token = await signUp(app, 'stale@example.com');
    const res = await request(app)
      .post('/api/v1/bookings')
      .set({ Authorization: token, 'Idempotency-Key': key('stale') })
      .send(bookingBody('qt_does_not_exist'))
      .expect(410);
    expect(res.body.error.code).toBe('OFFER_EXPIRED');
  });

  it('validates traveller details the airline would reject', async () => {
    const { app } = buildTestApp();
    const token = await signUp(app, 'validate@example.com');
    const quote = await getQuote(app, token);
    const send = (body: object) =>
      request(app)
        .post('/api/v1/bookings')
        .set({ Authorization: token, 'Idempotency-Key': key(String(Math.random())) })
        .send(body);

    await send(bookingBody(quote.quoteId, { acceptedTerms: false })).expect(400);
    await send(bookingBody(quote.quoteId, { passengers: [passenger({ type: 'infant' })] })).expect(400);
    await send(bookingBody(quote.quoteId, { passengers: [passenger({ dateOfBirth: '2099-01-01' })] })).expect(
      400,
    );
    const expiredPassport = await send(
      bookingBody(quote.quoteId, {
        passengers: [
          passenger({
            travelDocument: {
              type: 'passport',
              number: 'A1234567',
              issuingCountry: 'BD',
              expiryDate: '2020-01-01',
            },
          }),
        ],
      }),
    ).expect(400);
    expect(JSON.stringify(expiredPassport.body)).toMatch(/expired/i);
    // A rejected booking never echoes the document number back.
    expect(JSON.stringify(expiredPassport.body)).not.toContain('A1234567');
  });

  it('keeps bookings private and cancels only the owner trip', async () => {
    const { app } = buildTestApp();
    const owner = await signUp(app, 'owner2@example.com');
    const stranger = await signUp(app, 'stranger2@example.com');
    const quote = await getQuote(app, owner);
    const created = await request(app)
      .post('/api/v1/bookings')
      .set({ Authorization: owner, 'Idempotency-Key': key('private') })
      .send(bookingBody(quote.quoteId))
      .expect(201);
    const reference = created.body.data.reference as string;

    await request(app).get(`/api/v1/bookings/${reference}`).set('Authorization', stranger).expect(404);
    await request(app)
      .post(`/api/v1/bookings/${reference}/cancel`)
      .set('Authorization', stranger)
      .expect(404);
    await request(app).get(`/api/v1/bookings/${reference}`).expect(401);
    expect((await request(app).get('/api/v1/bookings').set('Authorization', stranger)).body.data).toEqual([]);

    const cancelled = await request(app)
      .post(`/api/v1/bookings/${reference}/cancel`)
      .set('Authorization', owner)
      .expect(200);
    expect(cancelled.body.data.state).toBe('REFUND_PENDING');
    // Cancelling twice is refused rather than silently repeated.
    await request(app).post(`/api/v1/bookings/${reference}/cancel`).set('Authorization', owner).expect(409);
  });

  it('downloads a real PDF itinerary for the booking owner only', async () => {
    const { app } = buildTestApp();
    const owner = await signUp(app, 'pdf-owner@example.com');
    const stranger = await signUp(app, 'pdf-stranger@example.com');
    const quote = await getQuote(app, owner);
    const created = await request(app)
      .post('/api/v1/bookings')
      .set({ Authorization: owner, 'Idempotency-Key': key('pdf') })
      .send(bookingBody(quote.quoteId))
      .expect(201);
    const reference = created.body.data.reference as string;

    const res = await request(app)
      .get(`/api/v1/bookings/${reference}/itinerary.pdf`)
      .set('Authorization', owner)
      .expect(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toBe(`attachment; filename="AeroNova-${reference}.pdf"`);
    expect(res.headers['cache-control']).toBe('private, no-store');
    const buf = res.body as Buffer;
    expect(buf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    expect(buf.length).toBeGreaterThan(1000);

    await request(app)
      .get(`/api/v1/bookings/${reference}/itinerary.pdf`)
      .set('Authorization', stranger)
      .expect(404);
    await request(app).get(`/api/v1/bookings/${reference}/itinerary.pdf`).expect(401);
    await request(app).get('/api/v1/bookings/nope1/itinerary.pdf').set('Authorization', owner).expect(404);
  });
});
