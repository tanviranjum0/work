import { Router } from 'express';
import { z } from 'zod';
import {
  AUDIT_EVENT_TYPES,
  BOOKING_STATES,
  type AdminMetrics,
  type AdminProviderStatus,
} from '@aeronova/shared';
import { NotFoundError } from '../../errors/app-error.js';
import { sendSuccess } from '../../http/respond.js';
import {
  currentUser,
  requireAuth,
  requireRole,
  type AuthDependencies,
} from '../../middlewares/authenticate.js';
import { createRateLimiter, RATE_LIMITS } from '../../middlewares/rate-limit.js';
import type { AccountService } from '../../services/account/account-service.js';
import type { AuditService } from '../../services/audit/audit-service.js';
import type { BookingService } from '../../services/booking/booking-service.js';
import type { AppConfig } from '../../config/env.js';

const limitParam = z.coerce.number().int().min(1).max(200).default(50);
const bookingStateFilter = z.enum(BOOKING_STATES).optional();
const auditTypeFilter = z.enum(AUDIT_EVENT_TYPES).optional();
const referenceParam = /^[A-Za-z0-9]{6}$/;

export interface AdminRouteServices {
  readonly accounts: AccountService;
  readonly bookings: BookingService;
  readonly audit: AuditService;
  readonly config: AppConfig;
}

/**
 * Read-only operational visibility for the ADMIN role: never a way to act on
 * someone's behalf, never a route that returns a secret. Every response here
 * has already gone through the same domain services regular users use
 * (`toProfile`, the booking snapshot shape, ...), so nothing admin-only leaks
 * a shape a normal response wouldn't also be safe to show.
 */
export const adminRoutes = (services: AdminRouteServices, auth: AuthDependencies): Router => {
  const router = Router();
  const guard = [
    requireAuth(auth),
    requireRole('ADMIN'),
    createRateLimiter(RATE_LIMITS.admin, 'admin'),
  ] as const;

  router.get('/metrics', ...guard, async (_req, res) => {
    const [users, bookings] = await Promise.all([
      services.accounts.adminListUsers(200),
      services.bookings.adminList({ limit: 500 }),
    ]);
    const bookingsByState: AdminMetrics['bookingsByState'] = {};
    const bookingTotalsByCurrency: AdminMetrics['bookingTotalsByCurrency'] = {};
    for (const b of bookings) {
      bookingsByState[b.state] = (bookingsByState[b.state] ?? 0) + 1;
      bookingTotalsByCurrency[b.currency] = (bookingTotalsByCurrency[b.currency] ?? 0) + b.total.amountMinor;
    }
    const metrics: AdminMetrics = {
      totalUsers: users.length,
      totalBookings: bookings.length,
      bookingsByState,
      bookingTotalsByCurrency,
    };
    sendSuccess(res, metrics);
  });

  router.get('/users', ...guard, async (req, res) => {
    const limit = limitParam.parse(req.query.limit);
    sendSuccess(res, await services.accounts.adminListUsers(limit));
  });

  router.get('/bookings', ...guard, async (req, res) => {
    const limit = limitParam.parse(req.query.limit);
    const state = bookingStateFilter.parse(req.query.state);
    sendSuccess(res, await services.bookings.adminList({ limit, ...(state ? { state } : {}) }));
  });

  router.get('/bookings/:reference', ...guard, async (req, res) => {
    const reference = String(req.params.reference ?? '');
    if (!referenceParam.test(reference)) throw new NotFoundError('We could not find that booking.');
    sendSuccess(res, await services.bookings.adminGet(reference));
  });

  router.get('/audit-log', ...guard, async (req, res) => {
    const limit = limitParam.parse(req.query.limit);
    const type = auditTypeFilter.parse(req.query.type);
    sendSuccess(res, await services.audit.list({ limit, ...(type ? { type } : {}) }));
  });

  router.get('/provider-status', ...guard, (_req, res) => {
    const { providers, appMode } = services.config;
    // Deliberately excludes config.secrets entirely: never even a masked/partial token.
    const status: AdminProviderStatus = {
      appMode,
      flightProvider: providers.flight,
      bookingProvider: providers.booking,
      paymentProvider: providers.payment,
      ticketingProvider: providers.ticketing,
      authProvider: 'dev',
    };
    sendSuccess(res, status);
  });

  // Confirms who the caller is without leaving the admin area — useful for the web app's own guard.
  router.get('/whoami', ...guard, (req, res) =>
    sendSuccess(res, { id: currentUser(req).id, roles: currentUser(req).roles }),
  );

  return router;
};
