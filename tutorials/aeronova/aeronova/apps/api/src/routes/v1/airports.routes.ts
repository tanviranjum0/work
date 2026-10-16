import { Router } from 'express';
import { z } from 'zod';
import { createRateLimiter, RATE_LIMITS } from '../../middlewares/rate-limit.js';
import { sendSuccess } from '../../http/respond.js';
import { NotFoundError } from '../../errors/app-error.js';
import type { AirportDirectory } from '../../services/airport-directory.js';

const searchQuery = z.strictObject({
  q: z.string().trim().min(2, { error: 'Type at least 2 characters.' }).max(64),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});

const codeParam = z.string().regex(/^[A-Za-z]{3}$/);

export const airportRoutes = (directory: AirportDirectory): Router => {
  const router = Router();

  router.get('/search', createRateLimiter(RATE_LIMITS.autocomplete, 'airports'), (req, res) => {
    const { q, limit } = searchQuery.parse(req.query);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    sendSuccess(res, directory.search(q, limit));
  });

  router.get('/:code', (req, res) => {
    const parsed = codeParam.safeParse(req.params.code);
    const airport = parsed.success ? directory.getAirport(parsed.data) : undefined;
    if (!airport) throw new NotFoundError("We don't have details for that airport.");
    res.setHeader('Cache-Control', 'public, max-age=86400');
    sendSuccess(res, { airport, nearby: directory.nearby(airport.iataCode) });
  });

  return router;
};
