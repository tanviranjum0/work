import { Router } from 'express';
import { z } from 'zod';
import { createRateLimiter, RATE_LIMITS } from '../../middlewares/rate-limit.js';
import { sendSuccess } from '../../http/respond.js';
import { NotFoundError } from '../../errors/app-error.js';
import type { FlightSearchService } from '../../services/search/flight-search-service.js';

const searchIdParam = z.string().regex(/^srch_[a-f0-9]{32}$/);

export const searchRoutes = (service: FlightSearchService): Router => {
  const router = Router();

  router.post('/flights', createRateLimiter(RATE_LIMITS.search, 'search'), async (req, res) => {
    const input = service.parseInput(req.body);
    sendSuccess(res, await service.search(input, req.requestId));
  });

  router.get('/:searchId', async (req, res) => {
    const id = searchIdParam.safeParse(req.params.searchId);
    if (!id.success) throw new NotFoundError('This search link is not valid.');
    sendSuccess(res, await service.getById(id.data));
  });

  return router;
};
