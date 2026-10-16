import request from 'supertest';
import type { Express } from 'express';
import { describe, expect, it } from 'vitest';
import { buildTestApp } from '../../test-support.js';

const traveler = {
  title: 'ms',
  givenName: 'Amelia',
  familyName: 'Earhart',
  dateOfBirth: '1990-07-24',
  nationality: 'US',
  loyaltyAccounts: [{ airlineCode: 'ba', number: 'BA12901014' }],
};

const signUp = async (app: Express, email: string) => {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email, password: 'a-long-enough-password' })
    .expect(201);
  return { token: res.body.data.accessToken as string, user: res.body.data.user };
};

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('accounts', () => {
  it('registers, signs in, and never returns or logs the password', async () => {
    const { app, logs } = buildTestApp();
    const { token, user } = await signUp(app, 'Amelia@Example.com ');
    expect(user).toMatchObject({ email: 'amelia@example.com', displayName: 'amelia', roles: ['USER'] });
    expect(user).not.toHaveProperty('passwordHash');

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'amelia@example.com', password: 'a-long-enough-password' })
      .expect(200);
    expect(login.body.data.tokenType).toBe('Bearer');
    const text = JSON.stringify(logs.lines) + JSON.stringify(login.body);
    expect(text).not.toContain('a-long-enough-password');
    expect(text).not.toContain('scrypt$');
    expect(token).not.toBe(login.body.data.accessToken);
  });

  it('refuses duplicate registration and wrong credentials without revealing which', async () => {
    const { app } = buildTestApp();
    await signUp(app, 'dup@example.com');
    const dup = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'dup@example.com', password: 'another-long-password' })
      .expect(409);
    expect(dup.body.error.message).toMatch(/already exists/);

    const wrongPassword = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'dup@example.com', password: 'wrong-but-long-enough' })
      .expect(401);
    const unknownUser = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrong-but-long-enough' })
      .expect(401);
    expect(wrongPassword.body.error.message).toBe(unknownUser.body.error.message);

    const short = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'x@example.com', password: 'short' })
      .expect(400);
    expect(short.body.error.issues[0].message).toMatch(/at least 10 characters/);
  });

  it('requires a valid token for account endpoints', async () => {
    const { app } = buildTestApp();
    await request(app).get('/api/v1/users/me').expect(401);
    await request(app).get('/api/v1/users/me').set(auth('not-a-token')).expect(401);
    await request(app).get('/api/v1/travelers').set({ Authorization: 'Basic abc' }).expect(401);
    // An unknown path is still 404, not a demand for credentials.
    await request(app).get('/api/v1/nothing-here').expect(404);
  });

  it('stores and updates preferences without blanking the rest', async () => {
    const { app } = buildTestApp();
    const { token } = await signUp(app, 'prefs@example.com');
    const patched = await request(app)
      .patch('/api/v1/users/me')
      .set(auth(token))
      .send({ displayName: 'Amelia E', preferences: { currency: 'BDT' } })
      .expect(200);
    expect(patched.body.data).toMatchObject({
      displayName: 'Amelia E',
      preferences: { currency: 'BDT', cabin: 'economy', maxStops: null },
    });

    const again = await request(app)
      .patch('/api/v1/users/me')
      .set(auth(token))
      .send({ preferences: { maxStops: 1 } })
      .expect(200);
    expect(again.body.data.preferences).toMatchObject({ currency: 'BDT', maxStops: 1 });
    expect(again.body.data.displayName).toBe('Amelia E');

    await request(app).patch('/api/v1/users/me').set(auth(token)).send({}).expect(400);
    await request(app)
      .patch('/api/v1/users/me')
      .set(auth(token))
      .send({ roles: ['ADMIN'] })
      .expect(400);
    expect((await request(app).get('/api/v1/users/me').set(auth(token))).body.data.roles).toEqual(['USER']);
  });

  it('keeps saved travellers and searches private to their owner', async () => {
    const { app } = buildTestApp();
    const owner = await signUp(app, 'owner@example.com');
    const stranger = await signUp(app, 'stranger@example.com');

    const created = await request(app)
      .post('/api/v1/travelers')
      .set(auth(owner.token))
      .send(traveler)
      .expect(201);
    const id = created.body.data.id as string;
    expect(created.body.data).toMatchObject({
      givenName: 'Amelia',
      loyaltyAccounts: [{ airlineCode: 'BA' }],
    });

    expect((await request(app).get('/api/v1/travelers').set(auth(owner.token))).body.data).toHaveLength(1);
    expect((await request(app).get('/api/v1/travelers').set(auth(stranger.token))).body.data).toEqual([]);

    // Knowing the id is not enough: reads, writes and deletes are all scoped to the owner.
    await request(app).patch(`/api/v1/travelers/${id}`).set(auth(stranger.token)).send(traveler).expect(404);
    await request(app).delete(`/api/v1/travelers/${id}`).set(auth(stranger.token)).expect(404);
    expect((await request(app).get('/api/v1/travelers').set(auth(owner.token))).body.data).toHaveLength(1);

    await request(app).delete(`/api/v1/travelers/${id}`).set(auth(owner.token)).expect(204);
    await request(app).delete(`/api/v1/travelers/${id}`).set(auth(owner.token)).expect(404);
    await request(app).delete('/api/v1/travelers/not-a-uuid').set(auth(owner.token)).expect(404);
  });

  it('validates traveller details and refuses identity document numbers', async () => {
    const { app } = buildTestApp();
    const { token } = await signUp(app, 'validate@example.com');
    const future = await request(app)
      .post('/api/v1/travelers')
      .set(auth(token))
      .send({ ...traveler, dateOfBirth: '2099-01-01' })
      .expect(400);
    expect(future.body.error.issues[0].message).toMatch(/in the future/);

    await request(app)
      .post('/api/v1/travelers')
      .set(auth(token))
      .send({ ...traveler, givenName: 'A1' })
      .expect(400);
    // Passport numbers are collected at booking, never stored on a saved traveller.
    const extra = await request(app)
      .post('/api/v1/travelers')
      .set(auth(token))
      .send({ ...traveler, passportNumber: 'X1234567' })
      .expect(400);
    expect(JSON.stringify(extra.body)).not.toContain('X1234567');
  });

  it('saves searches with their URL parameters and enforces ownership', async () => {
    const { app } = buildTestApp();
    const owner = await signUp(app, 'saver@example.com');
    const stranger = await signUp(app, 'other@example.com');
    const params = {
      trip: 'round',
      from: 'DAC',
      to: 'LHR',
      depart: '2026-12-20',
      return: '2027-01-05',
      adults: '1',
    };

    const saved = await request(app)
      .post('/api/v1/saved-searches')
      .set(auth(owner.token))
      .send({ label: 'Winter trip', params })
      .expect(201);
    expect(saved.body.data).toMatchObject({ label: 'Winter trip', params });

    await request(app)
      .post('/api/v1/saved-searches')
      .set(auth(owner.token))
      .send({ label: 'No trip type', params: { from: 'DAC' } })
      .expect(400);
    await request(app)
      .post('/api/v1/saved-searches')
      .set(auth(owner.token))
      .send({ label: 'Injected', params: { trip: 'round', from: '<script>' } })
      .expect(400);

    await request(app)
      .delete(`/api/v1/saved-searches/${saved.body.data.id}`)
      .set(auth(stranger.token))
      .expect(404);
    await request(app)
      .delete(`/api/v1/saved-searches/${saved.body.data.id}`)
      .set(auth(owner.token))
      .expect(204);
  });
});

describe('registration identity stability', () => {
  it('keeps the same user id across every request in the session, not just the first', async () => {
    // Regression test: the dev provider used to sign tokens with the created
    // user's id while indexing accounts by an unrelated, separately generated
    // subject, so the very first authenticated request after signup silently
    // created and switched to a second, shadow account with a different id.
    const { app } = buildTestApp();
    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'stable@example.com', password: 'a-long-enough-password' })
      .expect(201);
    const registeredId = reg.body.data.user.id;
    const token = reg.body.data.accessToken;

    const first = await request(app).get('/api/v1/users/me').set(auth(token)).expect(200);
    const second = await request(app).get('/api/v1/users/me').set(auth(token)).expect(200);
    expect(first.body.data.id).toBe(registeredId);
    expect(second.body.data.id).toBe(registeredId);
  });
});

describe('registration race safety', () => {
  it('lets exactly one of two concurrent same-email registrations succeed, never as a 500', async () => {
    const { app } = buildTestApp();
    const attempt = () =>
      request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'race@example.com', password: 'a-long-enough-password' });
    const [a, b] = await Promise.all([attempt(), attempt()]);

    const statuses = [a.status, b.status].sort();
    expect(statuses).toEqual([201, 409]);
    const conflict = a.status === 409 ? a : b;
    expect(conflict.body.error.message).toMatch(/already exists/);
    expect(conflict.body.error.code).toBe('VALIDATION_ERROR');

    // Only one account was actually created.
    const winnerToken = (a.status === 201 ? a : b).body.data.accessToken as string;
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'race@example.com', password: 'a-long-enough-password' })
      .expect(200);
    expect(login.body.data.user.id).toBe((a.status === 201 ? a : b).body.data.user.id);
    expect(winnerToken).not.toBe(login.body.data.accessToken); // different sign-ins issue different tokens
  });

  it('holds under five concurrent registrations for the same email: exactly one winner', async () => {
    const { app } = buildTestApp();
    const attempts = await Promise.all(
      Array.from({ length: 5 }, () =>
        request(app)
          .post('/api/v1/auth/register')
          .send({ email: 'crowd@example.com', password: 'a-long-enough-password' }),
      ),
    );
    expect(attempts.filter((r) => r.status === 201)).toHaveLength(1);
    expect(attempts.filter((r) => r.status === 409)).toHaveLength(4);
    expect(attempts.every((r) => r.status !== 500)).toBe(true);
  });
});
