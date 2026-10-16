import { z } from 'zod';
import { APP_MODES } from '@aeronova/shared';

const csv = z
  .string()
  .default('')
  .transform((v) =>
    v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

const bool = z
  .enum(['true', 'false', '1', '0'])
  .optional()
  .transform((v) => v === 'true' || v === '1');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_MODE: z.enum(APP_MODES).default('demo'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'silent']).default('info'),

  CORS_ORIGINS: csv,
  AUTH_PROVIDER: z.literal('dev').default('dev'),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
  REQUEST_BODY_LIMIT: z
    .string()
    .regex(/^\d+(kb|mb)$/)
    .default('100kb'),

  MONGODB_URI: z.string().optional(),

  FLIGHT_PROVIDER: z.enum(['mock', 'duffel']).default('mock'),
  BOOKING_PROVIDER: z.enum(['mock', 'duffel']).default('mock'),
  TICKETING_PROVIDER: z.enum(['mock']).default('mock'),
  PAYMENT_PROVIDER: z.enum(['mock']).default('mock'),
  DUFFEL_ACCESS_TOKEN: z.string().optional(),
  PROVIDER_TIMEOUT_MS: z.coerce.number().int().min(5_000).max(25_000).default(20_000),

  /** HS256 signing key for dev tokens. Generated per process when absent in demo mode. */
  DEV_AUTH_SECRET: z.string().min(32).optional(),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().min(5).max(720).default(60),
  /** Local/demo convenience only: this exact email gets ADMIN on its first registration via the dev provider. Forbidden in production. */
  DEMO_ADMIN_EMAIL: z.string().trim().toLowerCase().optional(),

  FEATURE_BOOKING: bool,
  FEATURE_PRICE_ALERTS: bool,
  FEATURE_AIRCRAFT_TRACKING: bool,
  FEATURE_DESTINATION_EXPLORE: bool,
});

export type RawEnv = z.input<typeof envSchema>;

/**
 * Cross-field rules that protect business credibility. Every rule here exists
 * because violating it would either leak a secret, show fake data as real, or
 * take a real action in the wrong environment.
 */
const validated = envSchema.superRefine((env, ctx) => {
  const fail = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [path], message });
  const isProd = env.APP_MODE === 'production';
  const token = env.DUFFEL_ACCESS_TOKEN;

  if (isProd && env.NODE_ENV !== 'production')
    fail('NODE_ENV', 'APP_MODE=production requires NODE_ENV=production.');
  if (isProd && env.FLIGHT_PROVIDER === 'mock')
    fail('FLIGHT_PROVIDER', 'Mock flight data is not allowed in production.');
  if (env.APP_MODE === 'test' && env.FLIGHT_PROVIDER === 'mock') {
    fail('FLIGHT_PROVIDER', 'APP_MODE=test means a supplier sandbox. Use APP_MODE=demo for mock data.');
  }
  if (
    isProd &&
    env.FEATURE_BOOKING &&
    (env.BOOKING_PROVIDER === 'mock' || env.TICKETING_PROVIDER === 'mock' || env.PAYMENT_PROVIDER === 'mock')
  ) {
    fail('FEATURE_BOOKING', 'Production booking requires real booking, payment and ticketing providers.');
  }

  const usesDuffel = env.FLIGHT_PROVIDER === 'duffel' || env.BOOKING_PROVIDER === 'duffel';
  if (usesDuffel && !token) fail('DUFFEL_ACCESS_TOKEN', 'Required when a Duffel provider is selected.');
  if (usesDuffel && token) {
    const isTestToken = token.startsWith('duffel_test_');
    if (isProd && isTestToken) fail('DUFFEL_ACCESS_TOKEN', 'Production cannot use a Duffel test token.');
    if (!isProd && !isTestToken)
      fail('DUFFEL_ACCESS_TOKEN', 'Only duffel_test_ tokens are allowed outside production.');
  }

  if (env.BOOKING_PROVIDER === 'duffel') {
    fail(
      'BOOKING_PROVIDER',
      'Duffel orders are not implemented; only simulated booking exists. Selecting it would silently book through the simulated provider.',
    );
  }
  const simulatedBooking =
    env.BOOKING_PROVIDER === 'mock' || env.TICKETING_PROVIDER === 'mock' || env.PAYMENT_PROVIDER === 'mock';
  if (env.FEATURE_BOOKING && env.FLIGHT_PROVIDER !== 'mock' && simulatedBooking) {
    fail(
      'FEATURE_BOOKING',
      'Simulated booking only works with simulated flights: booking a real supplier offer here would look like an order that was never placed.',
    );
  }
  // Test mode runs on in-memory stores until the MongoDB repositories land (Phase 4).
  if (isProd && !env.MONGODB_URI) fail('MONGODB_URI', 'Required in production.');
  if (env.APP_MODE === 'demo' && env.FLIGHT_PROVIDER !== 'mock') {
    fail(
      'FLIGHT_PROVIDER',
      'APP_MODE=demo shows curated sample data. Use APP_MODE=test for a supplier sandbox.',
    );
  }
  if (env.MONGODB_URI && !/^mongodb(\+srv)?:\/\//.test(env.MONGODB_URI))
    fail('MONGODB_URI', 'Must be a mongodb:// or mongodb+srv:// URI.');

  if (isProd) {
    if (env.CORS_ORIGINS.length === 0)
      fail('CORS_ORIGINS', 'Production requires an explicit origin allowlist.');
    for (const origin of env.CORS_ORIGINS) {
      if (origin === '*' || !origin.startsWith('https://'))
        fail('CORS_ORIGINS', `Production origin must be an https URL: "${origin}"`);
    }
    if (env.DEMO_ADMIN_EMAIL)
      fail('DEMO_ADMIN_EMAIL', 'This is a local/demo convenience and must not be set in production.');
    fail('APP_MODE', 'Production mode is unavailable while authentication is limited to the demo provider.');
  }
});

export class ConfigError extends Error {
  constructor(readonly issues: readonly string[]) {
    // Messages name the variable and the rule, never the value.
    super(`Invalid configuration:\n  - ${issues.join('\n  - ')}`);
    this.name = 'ConfigError';
  }
}

export interface AppConfig {
  readonly nodeEnv: 'development' | 'test' | 'production';
  readonly appMode: (typeof APP_MODES)[number];
  readonly port: number;
  readonly logLevel: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  readonly http: {
    readonly corsOrigins: readonly string[];
    readonly trustProxyHops: number;
    readonly bodyLimit: string;
  };
  readonly mongoUri: string | undefined;
  readonly providers: {
    readonly flight: 'mock' | 'duffel';
    readonly booking: 'mock' | 'duffel';
    readonly ticketing: 'mock';
    readonly payment: 'mock';
    readonly timeoutMs: number;
  };
  readonly secrets: {
    readonly duffelAccessToken: string | undefined;
  };
  readonly auth: {
    readonly provider: 'dev';
    readonly devSecret: string | undefined;
    readonly accessTokenTtlMinutes: number;
    readonly demoAdminEmail: string | undefined;
  };
  readonly features: {
    readonly booking: boolean;
    readonly priceAlerts: boolean;
    readonly aircraftTracking: boolean;
    readonly destinationExplore: boolean;
  };
}

const DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

export const loadConfig = (source: Record<string, string | undefined>): AppConfig => {
  const parsed = validated.safeParse(source);
  if (!parsed.success) {
    throw new ConfigError(parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`));
  }
  const e = parsed.data;
  const isProd = e.APP_MODE === 'production';
  return Object.freeze({
    nodeEnv: e.NODE_ENV,
    appMode: e.APP_MODE,
    port: e.PORT,
    logLevel: e.LOG_LEVEL,
    http: {
      corsOrigins: e.CORS_ORIGINS.length > 0 ? e.CORS_ORIGINS : isProd ? [] : DEV_ORIGINS,
      trustProxyHops: e.TRUST_PROXY_HOPS,
      bodyLimit: e.REQUEST_BODY_LIMIT,
    },
    mongoUri: e.MONGODB_URI,
    providers: {
      flight: e.FLIGHT_PROVIDER,
      booking: e.BOOKING_PROVIDER,
      ticketing: e.TICKETING_PROVIDER,
      payment: e.PAYMENT_PROVIDER,
      timeoutMs: e.PROVIDER_TIMEOUT_MS,
    },
    secrets: { duffelAccessToken: e.DUFFEL_ACCESS_TOKEN },
    auth: {
      provider: e.AUTH_PROVIDER,
      devSecret: e.DEV_AUTH_SECRET,
      accessTokenTtlMinutes: e.ACCESS_TOKEN_TTL_MINUTES,
      demoAdminEmail: e.DEMO_ADMIN_EMAIL,
    },
    features: {
      // Booking defaults on only for fully simulated data (demo); real supplier offers are never
      // "booked" through the simulated providers (config validation refuses that explicitly).
      booking:
        source.FEATURE_BOOKING === undefined ? e.FLIGHT_PROVIDER === 'mock' && !isProd : e.FEATURE_BOOKING,
      priceAlerts: e.FEATURE_PRICE_ALERTS,
      aircraftTracking: e.FEATURE_AIRCRAFT_TRACKING,
      destinationExplore:
        source.FEATURE_DESTINATION_EXPLORE === undefined ? true : e.FEATURE_DESTINATION_EXPLORE,
    },
  });
};
