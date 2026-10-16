import type { BaggageAllowance, CabinClass, ConditionValue } from '@aeronova/shared';

/*
 * Demo fare families. Each set models a real-world pattern (full-service
 * piece concept, weight concept, low-cost unbundled) so filters and fare
 * comparison have something meaningful to work with. One set deliberately
 * withholds baggage and conditions to exercise "Not provided" handling.
 */

export interface FareFamilySpec {
  readonly name: string;
  readonly multiplier: number;
  readonly cabinBag: BaggageAllowance;
  readonly checkedBag: BaggageAllowance;
  /** undefined = supplier did not say. */
  readonly refund: { value: ConditionValue; penaltyUsd?: number } | undefined;
  readonly change: { value: ConditionValue; penaltyUsd?: number } | undefined;
}

export type FareSetId = 'full_service' | 'weight_concept' | 'low_cost' | 'undisclosed';

const pieces = (quantity: number, kg: number): BaggageAllowance => ({
  kind: 'pieces',
  quantity,
  maxWeightKg: { status: 'provided', value: kg },
});
const weight = (totalKg: number): BaggageAllowance => ({ kind: 'weight', totalKg });
const NONE: BaggageAllowance = { kind: 'none' };
const UNKNOWN: BaggageAllowance = { kind: 'unknown' };

const ECONOMY_SETS: Record<FareSetId, readonly FareFamilySpec[]> = {
  full_service: [
    {
      name: 'Economy Light',
      multiplier: 1,
      cabinBag: pieces(1, 7),
      checkedBag: NONE,
      refund: { value: 'not_allowed' },
      change: { value: 'allowed_with_fee', penaltyUsd: 150 },
    },
    {
      name: 'Economy Classic',
      multiplier: 1.16,
      cabinBag: pieces(1, 7),
      checkedBag: pieces(1, 23),
      refund: { value: 'allowed_with_fee', penaltyUsd: 200 },
      change: { value: 'allowed_with_fee', penaltyUsd: 75 },
    },
    {
      name: 'Economy Flex',
      multiplier: 1.42,
      cabinBag: pieces(1, 7),
      checkedBag: pieces(2, 23),
      refund: { value: 'allowed_with_fee', penaltyUsd: 50 },
      change: { value: 'allowed' },
    },
  ],
  weight_concept: [
    {
      name: 'Economy Saver',
      multiplier: 1,
      cabinBag: weight(7),
      checkedBag: weight(20),
      refund: { value: 'allowed_with_fee', penaltyUsd: 120 },
      change: { value: 'allowed_with_fee', penaltyUsd: 60 },
    },
    {
      name: 'Economy Standard',
      multiplier: 1.14,
      cabinBag: weight(7),
      checkedBag: weight(30),
      refund: { value: 'allowed_with_fee', penaltyUsd: 80 },
      change: { value: 'allowed_with_fee', penaltyUsd: 40 },
    },
    {
      name: 'Economy Flexi',
      multiplier: 1.35,
      cabinBag: weight(10),
      checkedBag: weight(40),
      refund: { value: 'allowed_with_fee', penaltyUsd: 30 },
      change: { value: 'allowed' },
    },
  ],
  low_cost: [
    {
      name: 'Basic',
      multiplier: 1,
      cabinBag: weight(7),
      checkedBag: NONE,
      refund: { value: 'not_allowed' },
      change: { value: 'allowed_with_fee', penaltyUsd: 45 },
    },
    {
      name: 'Value Pack',
      multiplier: 1.28,
      cabinBag: weight(7),
      checkedBag: weight(20),
      refund: { value: 'not_allowed' },
      change: { value: 'allowed_with_fee', penaltyUsd: 30 },
    },
  ],
  undisclosed: [
    {
      name: 'Economy',
      multiplier: 1,
      cabinBag: UNKNOWN,
      checkedBag: UNKNOWN,
      refund: undefined,
      change: undefined,
    },
  ],
};

const PREMIUM_CABINS: Record<Exclude<CabinClass, 'economy'>, readonly FareFamilySpec[]> = {
  premium_economy: [
    {
      name: 'Premium Economy',
      multiplier: 1.85,
      cabinBag: pieces(1, 10),
      checkedBag: pieces(2, 23),
      refund: { value: 'allowed_with_fee', penaltyUsd: 100 },
      change: { value: 'allowed_with_fee', penaltyUsd: 50 },
    },
  ],
  business: [
    {
      name: 'Business Saver',
      multiplier: 3.6,
      cabinBag: pieces(2, 7),
      checkedBag: pieces(2, 32),
      refund: { value: 'allowed_with_fee', penaltyUsd: 250 },
      change: { value: 'allowed_with_fee', penaltyUsd: 100 },
    },
    {
      name: 'Business Flex',
      multiplier: 4.3,
      cabinBag: pieces(2, 7),
      checkedBag: pieces(3, 32),
      refund: { value: 'allowed' },
      change: { value: 'allowed' },
    },
  ],
  first: [
    {
      name: 'First',
      multiplier: 6.8,
      cabinBag: pieces(2, 7),
      checkedBag: pieces(3, 32),
      refund: { value: 'allowed' },
      change: { value: 'allowed' },
    },
  ],
};

export const fareFamiliesFor = (set: FareSetId, cabin: CabinClass): readonly FareFamilySpec[] =>
  cabin === 'economy' ? ECONOMY_SETS[set] : PREMIUM_CABINS[cabin];

/** Demo pricing ratios by passenger type, applied to the base fare. */
export const PASSENGER_FARE_RATIO = { adult: 1, child: 0.75, infant: 0.1 } as const;
export const PASSENGER_TAX_RATIO = { adult: 1, child: 1, infant: 0.3 } as const;
export const TAX_RATE = 0.14;
export const AIRPORT_FEE_USD_PER_JOURNEY = 18;
