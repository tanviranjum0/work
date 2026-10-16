import { describe, expect, it } from 'vitest';
import { memoryLogStream } from '../test-support.js';
import { createLogger } from './logger.js';

describe('logger redaction', () => {
  it('redacts credentials and traveller PII wherever they appear', () => {
    const { lines, stream } = memoryLogStream();
    const logger = createLogger({ level: 'info' }, stream);
    logger.info(
      {
        req: { headers: { authorization: 'Bearer abc', cookie: 'sid=1' } },
        traveler: {
          passportNumber: 'A1234567',
          dateOfBirth: '1990-01-01',
          email: 'a@b.c',
          firstName: 'Kept',
        },
        passengers: [
          { passportNumber: 'B7654321', dateOfBirth: '2000-01-01' },
          { travelDocument: { type: 'passport', number: 'BD1234567', expiryDate: '2031-01-01' } },
        ],
        provider: { clientSecret: 's3cr3t' },
        contact: { phone: '+8801700000000' },
      },
      'test',
    );
    const text = JSON.stringify(lines);
    for (const secret of [
      'Bearer abc',
      'sid=1',
      'A1234567',
      'B7654321',
      '1990-01-01',
      'a@b.c',
      's3cr3t',
      'BD1234567',
      '+8801700000000',
    ]) {
      expect(text).not.toContain(secret);
    }
    expect(text).toContain('[REDACTED]');
    expect(lines[0]?.message).toBe('test');
    expect(lines[0]?.level).toBe('info');
  });
});
