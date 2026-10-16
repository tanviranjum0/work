import { randomBytes } from 'node:crypto';
import type { Logger } from 'pino';
import { ConfigError, type AppConfig } from './config/env.js';
import type { AppDependencies } from './app.js';
import { AIRLINES } from './data/airlines.js';
import { AIRPORTS } from './data/airports.js';
import { createLogger } from './observability/logger.js';
import type { FlightProvider } from './providers/flight/flight-provider.js';
import { MockFlightProvider } from './providers/flight/mock/mock-flight-provider.js';
import { DuffelClient } from './providers/flight/duffel/duffel-client.js';
import { DuffelFlightProvider } from './providers/flight/duffel/duffel-flight-provider.js';
import { AirportDirectory } from './services/airport-directory.js';
import { createDemoCurrencyConverter } from './services/currency-service.js';
import { FlightSearchService } from './services/search/flight-search-service.js';
import { InMemorySearchStore } from './services/search/search-store.js';
import { FlexibleDatesService } from './services/search/flexible-dates-service.js';
import { AccountService } from './services/account/account-service.js';
import { BookingService } from './services/booking/booking-service.js';
import { MockBookingProvider } from './providers/booking/mock-booking-provider.js';
import { MockPaymentProvider } from './providers/payment/mock-payment-provider.js';
import { MockTicketingProvider } from './providers/ticketing/mock-ticketing-provider.js';
import { InMemoryBookingRepository, InMemoryIdempotencyStore } from './repositories/in-memory-booking.js';
import type { AuthProvider } from './auth/auth-provider.js';
import { DevAuthProvider } from './auth/dev-auth-provider.js';
import { createInMemoryRepositories } from './repositories/in-memory.js';
import { ensureMongoReady, mongoHealth } from './repositories/mongo/connection.js';
import { createMongoRepositories } from './repositories/mongo/repositories.js';
import { OfferPricingService } from './services/pricing/offer-pricing-service.js';
import { InMemoryQuoteStore } from './services/pricing/quote-store.js';
import { MongoQuoteStore, MongoSearchStore } from './repositories/mongo/stores.js';
import { createAuditService } from './services/audit/audit-service.js';
import { InMemoryAuditRepository } from './repositories/in-memory-audit.js';
import { MongoAuditRepository } from './repositories/mongo/audit-repository.js';

const createFlightProvider = (
  config: AppConfig,
  directory: AirportDirectory,
  logger: Logger,
): FlightProvider => {
  switch (config.providers.flight) {
    case 'mock':
      // A short artificial delay keeps loading states honest in demo mode; tests pass 0.
      return new MockFlightProvider({ directory, latencyMs: config.nodeEnv === 'test' ? 0 : 450 });
    case 'duffel': {
      const accessToken = config.secrets.duffelAccessToken;
      // Unreachable: config validation requires the token when Duffel is selected.
      if (!accessToken) throw new ConfigError(['DUFFEL_ACCESS_TOKEN: required for FLIGHT_PROVIDER=duffel']);
      return new DuffelFlightProvider({
        client: new DuffelClient({ accessToken, logger }),
        logger,
        // Leave Duffel room to return partial results before our own timeout fires.
        supplierTimeoutMs: config.providers.timeoutMs - 2_000,
      });
    }
  }
};

/**
 * Composition root. The only place that decides which concrete providers and
 * stores are used. Routes and services receive interfaces.
 */
export const buildDependencies = (
  config: AppConfig,
  logger: Logger = createLogger({ level: config.logLevel }),
): AppDependencies => {
  const airports = new AirportDirectory(AIRPORTS, AIRLINES);
  const provider = createFlightProvider(config, airports, logger);
  // Persist across API process restarts when a database is configured; process memory otherwise.
  const searches = config.mongoUri ? new MongoSearchStore() : new InMemorySearchStore();
  const fx = createDemoCurrencyConverter();
  const timeoutMs = config.providers.timeoutMs;
  const flightSearch = new FlightSearchService({
    provider,
    directory: airports,
    store: searches,
    fx,
    logger,
    timeoutMs,
  });
  // One quote store: pricing writes the quote, booking consumes it.
  const quotes = config.mongoUri ? new MongoQuoteStore() : new InMemoryQuoteStore();
  const pricing = new OfferPricingService({
    provider,
    searches,
    quotes,
    fx,
    logger,
    timeoutMs,
  });

  const flexibleDates = new FlexibleDatesService({
    provider,
    search: flightSearch,
    directory: airports,
    logger,
  });

  // Repositories: MongoDB when configured, otherwise process memory (demo only).
  const useMongo = config.mongoUri !== undefined;
  const mongoUri = config.mongoUri;
  // Awaited by every API request (see app.ts); started now so a cold start overlaps it with init.
  const ready = mongoUri ? () => ensureMongoReady({ uri: mongoUri, logger }) : () => Promise.resolve();
  void ready().catch((err: unknown) => logger.error({ err }, 'MongoDB not ready yet; requests will retry'));
  const repos = useMongo ? createMongoRepositories() : createInMemoryRepositories();
  if (!useMongo) logger.warn('No MONGODB_URI: accounts are kept in memory and lost on restart.');
  const audit = createAuditService(
    useMongo ? new MongoAuditRepository() : new InMemoryAuditRepository(),
    logger,
  );

  const authProvider: AuthProvider = new DevAuthProvider(
    // A generated secret is fine for a demo: tokens simply stop working after a restart.
    config.auth.devSecret ?? randomBytes(32).toString('hex'),
    config.auth.accessTokenTtlMinutes,
    config.appMode,
  );
  const accounts = new AccountService(repos);
  const bookings = new BookingService({
    quotes,
    bookings: new InMemoryBookingRepository(),
    idempotency: new InMemoryIdempotencyStore(),
    booking: new MockBookingProvider(),
    payment: new MockPaymentProvider(),
    ticketing: new MockTicketingProvider(),
    logger,
  });
  const auth = { provider: authProvider, accounts };
  const devAuth = authProvider instanceof DevAuthProvider ? { provider: authProvider, repos } : undefined;

  return {
    config,
    logger,
    services: {
      config,
      airports,
      flightSearch,
      pricing,
      flexibleDates,
      accounts,
      auth,
      audit,
      devAuth,
      bookings,
    },
    ready,
    readinessChecks: {
      database: async () => (useMongo ? mongoHealth() : 'skipped'),
    },
  };
};
