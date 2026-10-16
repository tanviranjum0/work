import { describe, expect, it } from 'vitest';
import { ConfigError, loadConfig } from './env.js';

const prodBase = {
  NODE_ENV: 'production',
  APP_MODE: 'production',
  FLIGHT_PROVIDER: 'duffel',
  DUFFEL_ACCESS_TOKEN: 'duffel_live_abc',
  MONGODB_URI: 'mongodb+srv://cluster.example.net/aeronova',
  CORS_ORIGINS: 'https://aeronova.example',
  AUTH_PROVIDER: 'dev',
};

const issuesFor = (env: Record<string, string>): string => {
  try {
    loadConfig(env);
    return '';
  } catch (err) {
    expect(err).toBeInstanceOf(ConfigError);
    return (err as ConfigError).message;
  }
};

describe('loadConfig', () => {
  it('runs with zero configuration in demo mode', () => {
    const c = loadConfig({});
    expect(c.appMode).toBe('demo');
    expect(c.providers.flight).toBe('mock');
    expect(c.features.booking).toBe(true);
    expect(c.http.corsOrigins).toContain('http://localhost:5173');
  });

  it('accepts a deployed demo using the app-managed sign-in', () => {
    const c = loadConfig({ NODE_ENV: 'production', APP_MODE: 'demo', AUTH_PROVIDER: 'dev' });
    expect(c.appMode).toBe('demo');
    expect(c.auth.provider).toBe('dev');
    expect(c.features.booking).toBe(true);
  });

  it('never allows mock flight data in production', () => {
    expect(issuesFor({ ...prodBase, FLIGHT_PROVIDER: 'mock' })).toMatch(/Mock flight data is not allowed/);
  });

  it('refuses production booking on simulated providers', () => {
    expect(issuesFor({ ...prodBase, FEATURE_BOOKING: 'true' })).toMatch(
      /real booking, payment and ticketing/,
    );
  });

  it('keeps Duffel test and live tokens in their own environments', () => {
    expect(issuesFor({ ...prodBase, DUFFEL_ACCESS_TOKEN: 'duffel_test_x' })).toMatch(
      /cannot use a Duffel test token/,
    );
    expect(
      issuesFor({
        APP_MODE: 'test',
        FLIGHT_PROVIDER: 'duffel',
        DUFFEL_ACCESS_TOKEN: 'duffel_live_x',
        MONGODB_URI: 'mongodb://localhost/x',
      }),
    ).toMatch(/Only duffel_test_ tokens/);
    expect(issuesFor({ APP_MODE: 'test', FLIGHT_PROVIDER: 'duffel' })).toMatch(
      /DUFFEL_ACCESS_TOKEN: Required/,
    );
  });

  it('rejects production mode until a production authentication provider is available', () => {
    expect(issuesFor(prodBase)).toMatch(/Production mode is unavailable/);
    expect(issuesFor({ ...prodBase, AUTH_PROVIDER: 'cognito' })).toMatch(/AUTH_PROVIDER/);
  });

  it('rejects wildcard or plain-http CORS origins in production', () => {
    expect(issuesFor({ ...prodBase, CORS_ORIGINS: '*' })).toMatch(/https URL/);
    expect(issuesFor({ ...prodBase, CORS_ORIGINS: 'http://example.com' })).toMatch(/https URL/);
    expect(issuesFor({ ...prodBase, CORS_ORIGINS: '' })).toMatch(/explicit origin allowlist/);
  });

  it('keeps each mode honest about its data source', () => {
    expect(issuesFor({ APP_MODE: 'test' })).toMatch(/Use APP_MODE=demo for mock data/);
    expect(
      issuesFor({ APP_MODE: 'demo', FLIGHT_PROVIDER: 'duffel', DUFFEL_ACCESS_TOKEN: 'duffel_test_x' }),
    ).toMatch(/Use APP_MODE=test for a supplier sandbox/);
    expect(issuesFor({ ...prodBase, MONGODB_URI: '' })).toMatch(/MONGODB_URI: Required in production/);
  });

  it('runs the Duffel sandbox without a database until repositories exist', () => {
    const c = loadConfig({
      APP_MODE: 'test',
      FLIGHT_PROVIDER: 'duffel',
      DUFFEL_ACCESS_TOKEN: 'duffel_test_abc',
    });
    expect(c.providers.flight).toBe('duffel');
    expect(c.mongoUri).toBeUndefined();
  });

  it('never echoes secret values in error messages', () => {
    const msg = issuesFor({ ...prodBase, DUFFEL_ACCESS_TOKEN: 'duffel_test_SUPERSECRET' });
    expect(msg).not.toContain('SUPERSECRET');
  });
});
