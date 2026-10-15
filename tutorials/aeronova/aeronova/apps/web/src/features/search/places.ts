import type { PlaceSummary } from '@aeronova/shared';

/** City name for a code, falling back to the code itself while data loads. */
export const cityOf = (places: Readonly<Record<string, PlaceSummary>> | undefined, code: string): string =>
  places?.[code]?.cityName ?? code;
