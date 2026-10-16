import { Router } from 'express';
import type { AirportDirectory } from '../services/airport-directory.js';
import type { FlightSearchService } from '../services/search/flight-search-service.js';
import { airportRoutes } from './v1/airports.routes.js';
import { searchRoutes } from './v1/search.routes.js';
import { offerRoutes } from './v1/offers.routes.js';
import type { OfferPricingService } from '../services/pricing/offer-pricing-service.js';
import type { FlexibleDatesService } from '../services/search/flexible-dates-service.js';
import { flexibleDateRoutes } from './v1/flexible.routes.js';
import { accountRoutes } from './v1/account.routes.js';
import { bookingRoutes } from './v1/booking.routes.js';
import type { BookingService } from '../services/booking/booking-service.js';
import { authRoutes } from './v1/auth.routes.js';
import { adminRoutes } from './v1/admin.routes.js';
import { clientConfigRoutes } from './v1/client-config.routes.js';
import type { AccountService } from '../services/account/account-service.js';
import type { AuditService } from '../services/audit/audit-service.js';
import type { AuthDependencies } from '../middlewares/authenticate.js';
import type { DevAuthProvider } from '../auth/dev-auth-provider.js';
import type { Repositories } from '../repositories/types.js';
import type { AppConfig } from '../config/env.js';

export interface ApiV1Services {
  readonly config: AppConfig;
  readonly accounts: AccountService;
  readonly auth: AuthDependencies;
  readonly audit: AuditService;
  /** Present when the demo password-based sign-in is enabled. */
  readonly devAuth: { provider: DevAuthProvider; repos: Repositories } | undefined;
  readonly airports: AirportDirectory;
  readonly flightSearch: FlightSearchService;
  readonly pricing: OfferPricingService;
  readonly flexibleDates: FlexibleDatesService;
  readonly bookings: BookingService;
}

/**
 * Versioned API surface. Upcoming mounts:
 *   Phase 6: /trips, /watchlists, /price-alerts, /notifications
 */
export const apiV1Routes = (services: ApiV1Services): Router => {
  const router = Router();
  router.use('/airports', airportRoutes(services.airports));
  router.use('/search/flexible', flexibleDateRoutes(services.flightSearch, services.flexibleDates));
  router.use('/search', searchRoutes(services.flightSearch));
  router.use('/offers', offerRoutes(services.pricing));
  if (services.devAuth) {
    router.use(
      '/auth',
      authRoutes(
        services.devAuth.provider,
        services.devAuth.repos,
        services.audit,
        services.config.auth.demoAdminEmail,
      ),
    );
  }
  // Not mounted at all when booking is disabled: a flag that only hides a button is not a control.
  if (services.config.features.booking) {
    router.use('/bookings', bookingRoutes(services.bookings, services.auth, services.audit));
  }
  router.use('/client-config', clientConfigRoutes(services.config));
  router.use(
    '/admin',
    adminRoutes(
      {
        accounts: services.accounts,
        bookings: services.bookings,
        audit: services.audit,
        config: services.config,
      },
      services.auth,
    ),
  );
  router.use('/', accountRoutes(services.accounts, services.auth));
  return router;
};
