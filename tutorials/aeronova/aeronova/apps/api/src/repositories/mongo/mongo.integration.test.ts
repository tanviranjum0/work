import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildTestApp } from '../../test-support.js';
import { disconnectMongo } from './connection.js';

/*
 * Runs the real Mongoose repositories against a real MongoDB-protocol server.
 * Opt-in: set MONGODB_TEST_URI (e.g. mongodb://127.0.0.1:27017/aeronova-it).
 * Developed against FerretDB 1.24 (MongoDB wire protocol, SQLite backend),
 * because no MongoDB server is available in the build environment. FerretDB is
 * not MongoDB Atlas: passing here proves the queries, indexes and error
 * translation work over a real connection, not that Atlas behaves identically.
 */
const uri = process.env.MONGODB_TEST_URI;
const run = uri ? describe : describe.skip;

run('MongoDB repositories against a real server', () => {
  beforeAll(async () => {
    const admin = await mongoose.createConnection(uri as string).asPromise();
    await admin.dropDatabase();
    await admin.close();
  }, 30_000);
  afterAll(async () => {
    await disconnectMongo();
  });

  const env = { MONGODB_URI: uri as string };
  const register = (app: Parameters<typeof request>[0], email: string) =>
    request(app).post('/api/v1/auth/register').send({ email, password: 'a-long-enough-password' });

  it('serves the very first request after startup, not a connection error', async () => {
    const { app } = buildTestApp(env);
    const res = await register(app, 'first@example.com');
    expect(res.status).toBe(201);
  }, 30_000);

  it('persists accounts across app instances, which is the point of the database', async () => {
    const first = buildTestApp(env).app;
    await register(first, 'durable@example.com').expect(201);
    const second = buildTestApp(env).app; // a different API instance, same database
    const login = await request(second)
      .post('/api/v1/auth/login')
      .send({ email: 'durable@example.com', password: 'a-long-enough-password' })
      .expect(200);
    expect(login.body.data.user.email).toBe('durable@example.com');
  }, 30_000);

  it('enforces one account per email through the unique index, across instances, as a 409', async () => {
    const [a, b] = [buildTestApp(env).app, buildTestApp(env).app];
    const results = await Promise.all([register(a, 'race@example.com'), register(b, 'race@example.com')]);
    expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
  }, 30_000);

  it('scopes saved travellers to their owner in real queries', async () => {
    const { app } = buildTestApp(env);
    const owner = (await register(app, 'owner@example.com').expect(201)).body.data.accessToken as string;
    const other = (await register(app, 'other@example.com').expect(201)).body.data.accessToken as string;
    const created = await request(app)
      .post('/api/v1/travelers')
      .set('Authorization', `Bearer ${owner}`)
      .send({ givenName: 'Ada', familyName: 'Lovelace', dateOfBirth: '1990-12-10' })
      .expect(201);
    const id = created.body.data.id as string;
    await request(app).delete(`/api/v1/travelers/${id}`).set('Authorization', `Bearer ${other}`).expect(404);
    const mine = await request(app)
      .get('/api/v1/travelers')
      .set('Authorization', `Bearer ${owner}`)
      .expect(200);
    expect(mine.body.data.map((t: { id: string }) => t.id)).toEqual([id]);
  }, 30_000);

  it('shares searches and price quotes across instances, so a price check can land on any instance', async () => {
    const [a, b] = [buildTestApp(env).app, buildTestApp(env).app];
    const token = (await register(a, 'shopper@example.com').expect(201)).body.data.accessToken as string;
    const search = await request(a)
      .post('/api/v1/search/flights')
      .send({
        tripType: 'one_way',
        cabin: 'economy',
        passengers: { adults: 1, children: 0, infants: 0 },
        journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-22' }],
      })
      .expect(200);
    const { searchId } = search.body.data;
    const offerId = search.body.data.offers[0].offer.id;
    await request(b).get(`/api/v1/search/${searchId}`).expect(200);
    const quote = await request(b)
      .post('/api/v1/offers/price')
      .set('Authorization', `Bearer ${token}`)
      .send({ searchId, offerId })
      .expect(200);
    expect(quote.body.data.quoteId).toBeTruthy();
  }, 30_000);
});
