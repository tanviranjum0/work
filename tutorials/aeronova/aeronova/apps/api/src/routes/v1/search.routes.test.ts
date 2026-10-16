import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildTestApp } from '../../test-support.js';

const body = {
  tripType: 'round_trip',
  cabin: 'economy',
  passengers: { adults: 1, children: 0, infants: 0 },
  journeys: [
    { origin: 'DAC', destination: 'DXB', departureDate: '2026-12-20' },
    { origin: 'DXB', destination: 'DAC', departureDate: '2027-01-05' },
  ],
};

describe('search and airport routes', () => {
  it('searches flights and reopens the result by id', async () => {
    const { app } = buildTestApp();
    const res = await request(app).post('/api/v1/search/flights').send(body).expect(200);
    expect(res.body.data.offers.length).toBeGreaterThan(0);
    expect(res.body.data.searchId).toMatch(/^srch_[a-f0-9]{32}$/);
    expect(JSON.stringify(res.body)).not.toMatch(/providerOfferId|"provider"/);

    const again = await request(app).get(`/api/v1/search/${res.body.data.searchId}`).expect(200);
    expect(again.body.data.searchId).toBe(res.body.data.searchId);
    await request(app).get('/api/v1/search/not-an-id').expect(404);
  });

  it('returns field-level validation issues for bad input and rejects injection-shaped bodies', async () => {
    const { app } = buildTestApp();
    const bad = await request(app)
      .post('/api/v1/search/flights')
      .send({ ...body, passengers: { adults: 1, children: 0, infants: 3 } })
      .expect(400);
    expect(bad.body.error.code).toBe('VALIDATION_ERROR');
    expect(bad.body.error.issues).toContainEqual({
      path: 'passengers.infants',
      message: 'Each infant must travel with an adult.',
    });

    const injected = await request(app)
      .post('/api/v1/search/flights')
      .send({
        ...body,
        journeys: [{ origin: { $ne: null }, destination: 'DXB', departureDate: '2026-12-20' }],
      })
      .expect(400);
    expect(injected.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns an empty result, not an error, when nothing flies', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/search/flights')
      .send({
        ...body,
        tripType: 'one_way',
        journeys: [{ origin: 'SYD', destination: 'DAC', departureDate: '2026-12-20' }],
      })
      .expect(200);
    expect(res.body.data.offers).toEqual([]);
  });

  it('rate-limits search per client', async () => {
    const { app } = buildTestApp();
    let last = 0;
    for (let i = 0; i < 21; i++) {
      const res = await request(app).post('/api/v1/search/flights').send(body);
      last = res.status;
      if (i === 0) expect(res.headers.ratelimit).toBeDefined();
    }
    expect(last).toBe(429);
  });

  it('serves airport autocomplete and details', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/api/v1/airports/search').query({ q: 'dha' }).expect(200);
    expect(res.body.data[0]).toMatchObject({ code: 'DAC', cityName: 'Dhaka' });
    expect(res.headers['cache-control']).toContain('max-age');

    const short = await request(app).get('/api/v1/airports/search').query({ q: 'd' }).expect(400);
    expect(short.body.error.issues[0].message).toBe('Type at least 2 characters.');
    await request(app).get('/api/v1/airports/search').query({ q: 'dha', extra: '1' }).expect(400);

    const lhr = await request(app).get('/api/v1/airports/lhr').expect(200);
    expect(lhr.body.data.airport.timeZone).toBe('Europe/London');
    await request(app).get('/api/v1/airports/QQQ').expect(404);
  });
});

describe('offer pricing route', () => {
  it('prices an offer from a search and validates references', async () => {
    const { app } = buildTestApp();
    const search = await request(app).post('/api/v1/search/flights').send(body).expect(200);
    const { searchId } = search.body.data;
    const offerId = search.body.data.offers[0].offer.id;

    const priced = await request(app).post('/api/v1/offers/price').send({ searchId, offerId }).expect(200);
    expect(['confirmed', 'changed']).toContain(priced.body.data.status);
    expect(priced.body.data.quoteId).toMatch(/^qt_/);

    const bad = await request(app).post('/api/v1/offers/price').send({ searchId: 'x', offerId }).expect(400);
    expect(bad.body.error.issues[0].message).toBe('Invalid search reference.');

    const gone = await request(app)
      .post('/api/v1/offers/price')
      .send({ searchId: 'srch_ffffffffffffffffffffffffffffffff', offerId })
      .expect(410);
    expect(gone.body.error.code).toBe('OFFER_EXPIRED');
  });

  it('serves nearby-date prices and validates the centre date', async () => {
    const { app } = buildTestApp();
    const res = await request(app).post('/api/v1/search/flexible').send(body).expect(200);
    expect(res.body.data.supported).toBe(true);
    expect(res.body.data.cells).toHaveLength(7);
    const bad = await request(app)
      .post('/api/v1/search/flexible')
      .send({
        ...body,
        journeys: [
          { ...body.journeys[0], origin: 'QQQ' },
          { ...body.journeys[1], destination: 'QQQ' },
        ],
      })
      .expect(400);
    expect(bad.body.error.code).toBe('INVALID_AIRPORT');
  });
});
