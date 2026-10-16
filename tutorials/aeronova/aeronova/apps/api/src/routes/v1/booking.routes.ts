import { Router } from 'express';
import { z } from 'zod';
import { createBookingInputSchema, ERROR_CODES, todayInTimeZone } from '@aeronova/shared';
import { AppError, NotFoundError } from '../../errors/app-error.js';
import { sendSuccess } from '../../http/respond.js';
import { currentUser, requireAuth, type AuthDependencies } from '../../middlewares/authenticate.js';
import { createRateLimiter, RATE_LIMITS } from '../../middlewares/rate-limit.js';
import { renderItineraryPdf } from '../../services/documents/itinerary-pdf.js';
import type { AuditService } from '../../services/audit/audit-service.js';
import type { BookingService } from '../../services/booking/booking-service.js';

const referenceParam = /^[A-Za-z0-9]{6}$/;
const idempotencyKey = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9._:-]{16,128}$/, { error: 'Idempotency-Key must be 16-128 safe characters.' });

export const bookingRoutes = (
  bookings: BookingService,
  auth: AuthDependencies,
  audit: AuditService,
): Router => {
  const router = Router();
  const guard = [requireAuth(auth), createRateLimiter(RATE_LIMITS.booking, 'booking')] as const;

  router.post('/', ...guard, async (req, res) => {
    // Required, not optional: a retried or double-clicked purchase must not book twice.
    const key = idempotencyKey.safeParse(req.get('idempotency-key'));
    if (!key.success) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 400, 'This request needs an Idempotency-Key header.');
    }
    const input = createBookingInputSchema({ today: todayInTimeZone('UTC') }).parse(req.body);
    const user = currentUser(req);
    const booking = await bookings.create(input, {
      userId: user.id,
      idempotencyKey: key.data,
      requestId: req.requestId,
    });
    audit.record('BOOKING_CREATED', {
      requestId: req.requestId,
      actorUserId: user.id,
      actorEmail: user.email,
      context: { reference: booking.reference, state: booking.state },
    });
    sendSuccess(res, booking, 201);
  });

  router.get('/', ...guard, async (req, res) => sendSuccess(res, await bookings.list(currentUser(req).id)));

  router.get('/:reference', ...guard, async (req, res) => {
    const reference = String(req.params.reference ?? '');
    if (!referenceParam.test(reference)) throw new NotFoundError('We could not find that booking.');
    sendSuccess(res, await bookings.get(currentUser(req).id, reference));
  });

  router.post('/:reference/cancel', ...guard, async (req, res) => {
    const reference = String(req.params.reference ?? '');
    if (!referenceParam.test(reference)) throw new NotFoundError('We could not find that booking.');
    const user = currentUser(req);
    const booking = await bookings.cancel(user.id, reference);
    audit.record('BOOKING_CANCELLED', {
      requestId: req.requestId,
      actorUserId: user.id,
      actorEmail: user.email,
      context: { reference: booking.reference, state: booking.state },
    });
    sendSuccess(res, booking);
  });

  router.get('/:reference/itinerary.pdf', ...guard, async (req, res) => {
    const reference = String(req.params.reference ?? '');
    if (!referenceParam.test(reference)) throw new NotFoundError('We could not find that booking.');
    // Same ownership-scoped lookup as GET /:reference: another user's reference is a 404, not a 403,
    // so the response gives no signal about whether the reference exists at all.
    const booking = await bookings.get(currentUser(req).id, reference);
    // referenceParam already constrains this to safe filename characters.
    const pdf = await renderItineraryPdf(booking);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="AeroNova-${reference}.pdf"`);
    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200).send(pdf);
  });

  return router;
};
