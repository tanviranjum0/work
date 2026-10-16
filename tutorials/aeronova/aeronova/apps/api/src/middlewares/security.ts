import cors from 'cors';
import helmet from 'helmet';
import type { RequestHandler } from 'express';
import type { AppConfig } from '../config/env.js';

/**
 * The API serves JSON only, so its CSP can be maximally strict. The web app's
 * CSP is set separately by Vercel, where it can match the SPA's needs.
 */
export const securityHeaders = (config: AppConfig): RequestHandler =>
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'no-referrer' },
    strictTransportSecurity:
      config.nodeEnv === 'production'
        ? { maxAge: 63_072_000, includeSubDomains: true, preload: false }
        : false,
  });

export const permissionsPolicy = (): RequestHandler => (_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.setHeader('Cache-Control', 'no-store');
  next();
};

export const corsPolicy = (config: AppConfig): RequestHandler => {
  const allowed = new Set(config.http.corsOrigins);
  return cors({
    origin: (origin, cb) => cb(null, origin === undefined || allowed.has(origin)),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id', 'RateLimit', 'RateLimit-Policy', 'Retry-After'],
    credentials: false, // Bearer tokens, not cookies: see docs/SECURITY.md (CSRF strategy).
    maxAge: 600,
  });
};
