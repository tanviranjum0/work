import { Router } from 'express';
import { createRateLimiter, RATE_LIMITS } from '../../middlewares/rate-limit.js';
import { sendSuccess } from '../../http/respond.js';
import type { FlexibleDatesService } from '../../services/search/flexible-dates-service.js';
import type { FlightSearchService } from '../../services/search/flight-search-service.js';

export const flexibleDateRoutes = (search: FlightSearchService, flexible: FlexibleDatesService): Router => {
  const router = Router();
  router.post('/', createRateLimiter(RATE_LIMITS.flexibleDates, 'flexible'), async (req, res) => {
    // Same validation as a normal search: the centre date must itself be valid.
    const input = search.parseInput(req.body);
    sendSuccess(res, await flexible.lowestFares(input, req.requestId));
  });
  return router;
};
