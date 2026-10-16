/**
 * DEMO       – curated mock data, simulated booking/ticketing. Safe to run with zero credentials.
 * TEST       – real supplier sandbox (e.g. Duffel test mode). Data is supplier sandbox data, not live fares.
 * PRODUCTION – real supplier. Mock providers are forbidden and there is never a silent mock fallback.
 */
export const APP_MODES = ['demo', 'test', 'production'] as const;
export type AppMode = (typeof APP_MODES)[number];

export const isSimulatedMode = (mode: AppMode): boolean => mode !== 'production';
