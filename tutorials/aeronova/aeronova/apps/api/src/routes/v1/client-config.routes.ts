import { Router } from 'express';
import type { ClientConfig } from '@aeronova/shared';
import type { AppConfig } from '../../config/env.js';
import { sendSuccess } from '../../http/respond.js';

export const clientConfigRoutes = (config: AppConfig): Router => {
  const body: ClientConfig = {
    appMode: config.appMode,
    features: { booking: config.features.booking },
  };
  return Router().get('/', (_req, res) => sendSuccess(res, body));
};
