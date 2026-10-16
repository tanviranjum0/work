import { Router } from 'express';
import { z } from 'zod';
import { sendSuccess } from '../../http/respond.js';
import { createRateLimiter, RATE_LIMITS } from '../../middlewares/rate-limit.js';
import type { OfferPricingService } from '../../services/pricing/offer-pricing-service.js';

const priceBody = z.strictObject({
  searchId: z.string().regex(/^srch_[a-f0-9]{32}$/, { error: 'Invalid search reference.' }),
  offerId: z.string().regex(/^off_[a-z0-9]{8,32}$/, { error: 'Invalid offer reference.' }),
});

export const offerRoutes = (pricing: OfferPricingService): Router => {
  const router = Router();
  router.post('/price', createRateLimiter(RATE_LIMITS.pricing, 'pricing'), async (req, res) => {
    const body = priceBody.parse(req.body);
    sendSuccess(res, await pricing.price(body, req.requestId));
  });
  return router;
};
