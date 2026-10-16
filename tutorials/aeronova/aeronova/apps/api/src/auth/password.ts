import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

interface ScryptParams {
  N: number;
  r: number;
  p: number;
  maxmem: number;
}
const scrypt = promisify(scryptCallback) as (
  p: string,
  s: Buffer,
  k: number,
  o: ScryptParams,
) => Promise<Buffer>;

/**
 * N=2^16, r=8, p=1 needs ~64 MiB per hash: within OWASP's guidance. Node's
 * default 32 MiB cap must be raised explicitly.
 */
const PARAMS = { N: 1 << 16, r: 8, p: 1 };
const MAX_MEM = 192 * 1024 * 1024;
const KEY_LENGTH = 64;

/**
 * Password hashing for the demo auth provider.
 *
 * Format: scrypt$N$r$p$salt$hash (base64url).
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const hash = await scrypt(password.normalize('NFKC'), salt, KEY_LENGTH, { ...PARAMS, maxmem: MAX_MEM });
  return [
    'scrypt',
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString('base64url'),
    hash.toString('base64url'),
  ].join('$');
};

export const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const [scheme, n, r, p, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !n || !r || !p || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = await scrypt(password.normalize('NFKC'), Buffer.from(salt, 'base64url'), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: MAX_MEM,
  });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};
