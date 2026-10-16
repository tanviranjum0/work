import { describe, expect, it, vi } from 'vitest';
import { InvalidTokenError } from './auth-provider.js';
import { DevAuthProvider } from './dev-auth-provider.js';
import { hashPassword, verifyPassword } from './password.js';

const SECRET = 'a'.repeat(32);
const provider = () => new DevAuthProvider(SECRET, 60, 'demo');

describe('password hashing', () => {
  it('never stores the password and verifies only the right one', async () => {
    const stored = await hashPassword('correct horse battery staple');
    expect(stored).not.toContain('correct horse');
    expect(stored.startsWith('scrypt$')).toBe(true);
    await expect(verifyPassword('correct horse battery staple', stored)).resolves.toBe(true);
    await expect(verifyPassword('Correct horse battery staple', stored)).resolves.toBe(false);
    await expect(verifyPassword('', stored)).resolves.toBe(false);
  });

  it('salts each hash and survives unicode normalisation differences', async () => {
    const [a, b] = await Promise.all([hashPassword('same password'), hashPassword('same password')]);
    expect(a).not.toBe(b);
    // "é" composed vs decomposed: the same password as typed on different keyboards.
    const stored = await hashPassword('caf\u00e9 password');
    await expect(verifyPassword('cafe\u0301 password', stored)).resolves.toBe(true);
  });

  it('rejects malformed stored values instead of throwing', async () => {
    for (const bad of ['', 'not-a-hash', 'scrypt$1$2$3', 'bcrypt$1$8$1$aa$bb']) {
      await expect(verifyPassword('x', bad)).resolves.toBe(false);
    }
  });
});

describe('DevAuthProvider', () => {
  it('round-trips an identity', async () => {
    const p = provider();
    const { accessToken, expiresInSeconds } = await p.issue({
      subject: 'user-1',
      email: 'a@b.co',
      roles: ['USER'],
    });
    expect(expiresInSeconds).toBe(3600);
    await expect(p.verify(accessToken)).resolves.toEqual({
      subject: 'user-1',
      email: 'a@b.co',
      emailVerified: true,
      roles: ['USER'],
    });
  });

  it('refuses tokens it did not sign, tampered tokens and expired ones', async () => {
    const p = provider();
    const { accessToken } = await p.issue({ subject: 'user-1', email: 'a@b.co', roles: ['USER'] });
    const other = new DevAuthProvider('b'.repeat(32), 60, 'demo');
    await expect(other.verify(accessToken)).rejects.toBeInstanceOf(InvalidTokenError);

    const [header, payload, signature] = accessToken.split('.');
    const forged = `${header}.${Buffer.from('{"sub":"admin","email":"a@b.co","roles":["ADMIN"]}').toString('base64url')}.${signature}`;
    await expect(p.verify(forged)).rejects.toBeInstanceOf(InvalidTokenError);
    // An unsigned "none" token must never be accepted.
    await expect(
      p.verify(`${Buffer.from('{"alg":"none"}').toString('base64url')}.${payload}.`),
    ).rejects.toBeInstanceOf(InvalidTokenError);

    const expired = new DevAuthProvider(SECRET, 5, 'demo');
    const stale = await expired.issue({ subject: 'u', email: 'a@b.co', roles: [] });
    await new Promise((r) => setTimeout(r, 5));
    const future = new Date(Date.now() + 10 * 60_000);
    vi.setSystemTime?.(future);
    await expect(expired.verify(stale.accessToken)).rejects.toBeInstanceOf(InvalidTokenError);
    vi.useRealTimers?.();
  });

  it('cannot be constructed in production mode or with a weak secret', () => {
    expect(() => new DevAuthProvider(SECRET, 60, 'production')).toThrow(/production mode/);
    expect(() => new DevAuthProvider('short', 60, 'demo')).toThrow(/32 characters/);
  });
});
