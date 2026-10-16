import pino, { type LevelWithSilent, type Logger } from 'pino';
import { getRequestContext } from './request-context.js';

/**
 * Paths are redacted wherever they appear in a log object. Extend this list
 * whenever a new sensitive field is introduced; never rely on "not logging it".
 */
export const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers["x-origin-verify"]',
  'req.headers.cookie',
  'req.headers["x-api-key"]',
  'res.headers["set-cookie"]',
  '*.password',
  '*.newPassword',
  '*.token',
  '*.accessToken',
  '*.refreshToken',
  '*.idToken',
  '*.secret',
  '*.clientSecret',
  '*.passportNumber',
  '*.travelDocument',
  'passengers[*].travelDocument',
  'contact.phone',
  '*.documentNumber',
  '*.cardNumber',
  '*.cvc',
  '*.cvv',
  '*.dateOfBirth',
  '*.phone',
  '*.email',
  'passengers[*].passportNumber',
  'passengers[*].dateOfBirth',
  'travelers[*].passportNumber',
  'travelers[*].dateOfBirth',
];

export const createLogger = (
  opts: { level: LevelWithSilent; service?: string },
  destination?: pino.DestinationStream,
): Logger =>
  pino(
    {
      level: opts.level,
      base: { service: opts.service ?? 'aeronova-api' },
      messageKey: 'message',
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: { level: (label) => ({ level: label }) },
      redact: { paths: REDACT_PATHS, censor: '[REDACTED]' },
      // Attach request identifiers to every log line emitted inside a request.
      mixin: () => {
        const ctx = getRequestContext();
        return ctx ? { requestId: ctx.requestId, correlationId: ctx.correlationId } : {};
      },
    },
    destination,
  );
