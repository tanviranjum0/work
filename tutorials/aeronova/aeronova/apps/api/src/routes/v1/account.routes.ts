import { Router } from 'express';
import { z } from 'zod';
import {
  createTravelerInputSchema,
  savedSearchInputSchema,
  todayInTimeZone,
  updateProfileSchema,
} from '@aeronova/shared';
import { NotFoundError } from '../../errors/app-error.js';
import { sendSuccess } from '../../http/respond.js';
import { currentUser, requireAuth, type AuthDependencies } from '../../middlewares/authenticate.js';
import { createRateLimiter, RATE_LIMITS } from '../../middlewares/rate-limit.js';
import { toProfile } from '../../services/account/account-service.js';
import type { AccountService } from '../../services/account/account-service.js';

const idParam = z.uuid();

/** A malformed id is treated exactly like someone else's id: not found. */
const requireId = (value: string | string[] | undefined): string => {
  const parsed = idParam.safeParse(value);
  if (!parsed.success) throw new NotFoundError('We could not find that.');
  return parsed.data;
};

export const accountRoutes = (accounts: AccountService, auth: AuthDependencies): Router => {
  const router = Router();
  // Guards are attached per route, not with `router.use`, so an unknown path
  // still answers 404 instead of demanding a token for something that doesn't exist.
  const guard = [requireAuth(auth), createRateLimiter(RATE_LIMITS.account, 'account')] as const;

  router.get('/users/me', ...guard, (req, res) => sendSuccess(res, toProfile(currentUser(req))));

  router.patch('/users/me', ...guard, async (req, res) => {
    const patch = updateProfileSchema.parse(req.body);
    sendSuccess(res, await accounts.updateProfile(currentUser(req).id, patch));
  });

  router.get('/travelers', ...guard, async (req, res) =>
    sendSuccess(res, await accounts.listTravelers(currentUser(req).id)),
  );

  router.post('/travelers', ...guard, async (req, res) => {
    // Dates of birth are checked against today in UTC; a day either way is not material here.
    const input = createTravelerInputSchema({ today: todayInTimeZone('UTC') }).parse(req.body);
    sendSuccess(res, await accounts.createTraveler(currentUser(req).id, input), 201);
  });

  router.patch('/travelers/:travelerId', ...guard, async (req, res) => {
    const id = requireId(req.params.travelerId);
    const input = createTravelerInputSchema({ today: todayInTimeZone('UTC') }).parse(req.body);
    sendSuccess(res, await accounts.updateTraveler(currentUser(req).id, id, input));
  });

  router.delete('/travelers/:travelerId', ...guard, async (req, res) => {
    await accounts.deleteTraveler(currentUser(req).id, requireId(req.params.travelerId));
    res.status(204).end();
  });

  router.get('/saved-searches', ...guard, async (req, res) =>
    sendSuccess(res, await accounts.listSavedSearches(currentUser(req).id)),
  );

  router.post('/saved-searches', ...guard, async (req, res) => {
    const input = savedSearchInputSchema.parse(req.body);
    sendSuccess(res, await accounts.createSavedSearch(currentUser(req).id, input), 201);
  });

  router.delete('/saved-searches/:savedSearchId', ...guard, async (req, res) => {
    await accounts.deleteSavedSearch(currentUser(req).id, requireId(req.params.savedSearchId));
    res.status(204).end();
  });

  return router;
};
