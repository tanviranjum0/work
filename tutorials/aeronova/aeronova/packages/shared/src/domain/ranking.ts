import type { Money } from '../money/money.js';
import { money } from '../money/money.js';
import { wallHour } from '../dates/zoned-time.js';
import type { FlightJourney, FlightOffer } from './flight.js';

/*
 * AeroNova score and itinerary insights.
 *
 * Pure and deterministic so the server and the browser produce identical
 * results, and so the traveller can re-weight results without a new search.
 * The score is AeroNova's own heuristic, not an industry rating.
 */

export interface RankingWeights {
  readonly price: number;
  readonly duration: number;
  readonly stops: number;
  readonly baggage: number;
  readonly convenience: number;
}

export const DEFAULT_RANKING_WEIGHTS: RankingWeights = Object.freeze({
  price: 0.45,
  duration: 0.3,
  stops: 0.12,
  baggage: 0.06,
  convenience: 0.07,
});

export interface InsightThresholds {
  /** Layovers shorter than this are flagged as potentially tight. */
  readonly tightConnectionMinutes: number;
  readonly longConnectionMinutes: number;
  /** Departures at or after this local hour, or before `redEyeEndHour`, are red-eye. */
  readonly redEyeStartHour: number;
  readonly redEyeEndHour: number;
  /** A layover touching this local window counts as overnight. */
  readonly overnightStartHour: number;
  readonly overnightEndHour: number;
}

export const DEFAULT_INSIGHT_THRESHOLDS: InsightThresholds = Object.freeze({
  tightConnectionMinutes: 75,
  longConnectionMinutes: 6 * 60,
  redEyeStartHour: 22,
  redEyeEndHour: 5,
  overnightStartHour: 0,
  overnightEndHour: 5,
});

export type Tristate = 'yes' | 'no' | 'unknown';

export interface OfferMetrics {
  readonly totalTravelMinutes: number;
  readonly airborneMinutes: number;
  readonly layoverMinutes: number;
  readonly stops: number;
  readonly shortestLayoverMinutes: number | null;
  readonly longestLayoverMinutes: number | null;
  readonly hasTightConnection: boolean;
  readonly hasLongConnection: boolean;
  readonly hasOvernightLayover: boolean;
  readonly hasAirportChange: boolean;
  readonly hasSelfTransfer: Tristate;
  readonly hasRedEye: boolean;
  readonly checkedBagIncluded: Tristate;
  readonly refundable: Tristate;
  readonly changeable: Tristate;
  /** Heuristic only. Minor units of the offer currency per hour of travel. */
  readonly pricePerTravelHour: Money;
  /** First journey: local-clock arrival minus local-clock departure minus travel time. */
  readonly clockShiftMinutes: number;
}

export type OfferBadge = 'best_overall' | 'cheapest' | 'fastest' | 'best_value';

export interface RankedOffer {
  readonly offer: FlightOffer;
  readonly metrics: OfferMetrics;
  /** 0–100, relative to this result set only. */
  readonly score: number;
  readonly badges: readonly OfferBadge[];
  /** Relative to the cheapest and fastest offers in the same result set. */
  readonly comparison: {
    readonly priceDeltaVsCheapest: Money;
    readonly priceDeltaPercentVsCheapest: number;
    readonly durationDeltaVsFastestMinutes: number;
  };
}

const journeyStops = (j: FlightJourney) =>
  j.segments.length - 1 + j.segments.reduce((n, s) => n + s.technicalStops.length, 0);

const overlapsWindow = (startWall: string, minutes: number, fromHour: number, toHour: number): boolean => {
  // Walk the layover in 30-minute steps on the local clock; cheap and adequate for UI flags.
  const startHour = wallHour(startWall);
  const startMinute = Number(startWall.slice(14, 16));
  for (let m = 0; m <= minutes; m += 30) {
    const h = Math.floor((startHour * 60 + startMinute + m) / 60) % 24;
    if (h >= fromHour && h < toHour) return true;
  }
  return false;
};

const conditionTristate = (c: FlightOffer['conditions']['refund']): Tristate =>
  c.status === 'not_provided' ? 'unknown' : c.value.value === 'not_allowed' ? 'no' : 'yes';

export const computeOfferMetrics = (
  offer: FlightOffer,
  t: InsightThresholds = DEFAULT_INSIGHT_THRESHOLDS,
): OfferMetrics => {
  let total = 0;
  let airborne = 0;
  let stops = 0;
  const layovers: number[] = [];
  let overnight = false;
  let airportChange = false;
  let selfTransfer: Tristate = 'no';
  let redEye = false;

  for (const j of offer.journeys) {
    total += j.totalDurationMinutes;
    stops += journeyStops(j);
    for (const s of j.segments) {
      airborne += s.durationMinutes;
      const h = wallHour(s.departure.local);
      if (h >= t.redEyeStartHour || h < t.redEyeEndHour) redEye = true;
    }
    for (const l of j.layovers) {
      layovers.push(l.durationMinutes);
      airportChange ||= l.requiresAirportChange;
      if (l.selfTransfer.status === 'not_provided') {
        if (selfTransfer === 'no') selfTransfer = 'unknown';
      } else if (l.selfTransfer.value) {
        selfTransfer = 'yes';
      }
      const arrivingSegment = j.segments.find((s) => s.id === l.afterSegmentId);
      if (arrivingSegment) {
        overnight ||= overlapsWindow(
          arrivingSegment.arrival.local,
          l.durationMinutes,
          t.overnightStartHour,
          t.overnightEndHour,
        );
      }
    }
  }

  const bag = offer.baggage.checked;
  const checked: Tristate = bag.kind === 'unknown' ? 'unknown' : bag.kind === 'none' ? 'no' : 'yes';
  const first = offer.journeys[0];
  const firstSeg = first?.segments[0];
  const lastSeg = first?.segments[first.segments.length - 1];
  const clockShift =
    firstSeg && lastSeg && first
      ? Math.round(
          (Date.parse(`${lastSeg.arrival.local}Z`) - Date.parse(`${firstSeg.departure.local}Z`)) / 60_000 -
            first.totalDurationMinutes,
        )
      : 0;

  const hours = Math.max(total / 60, 1);
  return {
    totalTravelMinutes: total,
    airborneMinutes: airborne,
    layoverMinutes: layovers.reduce((a, b) => a + b, 0),
    stops,
    shortestLayoverMinutes: layovers.length ? Math.min(...layovers) : null,
    longestLayoverMinutes: layovers.length ? Math.max(...layovers) : null,
    hasTightConnection: layovers.some((m) => m < t.tightConnectionMinutes),
    hasLongConnection: layovers.some((m) => m >= t.longConnectionMinutes),
    hasOvernightLayover: overnight,
    hasAirportChange: airportChange,
    hasSelfTransfer: selfTransfer,
    hasRedEye: redEye,
    checkedBagIncluded: checked,
    refundable: conditionTristate(offer.conditions.refund),
    changeable: conditionTristate(offer.conditions.change),
    pricePerTravelHour: money(
      Math.round(offer.price.customerTotal.amountMinor / hours),
      offer.price.currency,
    ),
    clockShiftMinutes: clockShift,
  };
};

/** 1 for the best value in the set, 0 for the worst. Equal values score 1. */
const normalizeLowerIsBetter = (value: number, min: number, max: number) =>
  max === min ? 1 : 1 - (value - min) / (max - min);

const convenienceScore = (m: OfferMetrics): number => {
  let penalty = 0;
  if (m.hasRedEye) penalty += 0.25;
  if (m.hasOvernightLayover) penalty += 0.25;
  if (m.hasTightConnection) penalty += 0.2;
  if (m.hasLongConnection) penalty += 0.15;
  if (m.hasAirportChange) penalty += 0.3;
  if (m.hasSelfTransfer === 'yes') penalty += 0.35;
  return Math.max(0, 1 - penalty);
};

const baggageScore = (m: OfferMetrics): number =>
  m.checkedBagIncluded === 'yes' ? 1 : m.checkedBagIncluded === 'unknown' ? 0.5 : 0;

export const normalizeWeights = (w: RankingWeights): RankingWeights => {
  const values = [w.price, w.duration, w.stops, w.baggage, w.convenience].map((v) => Math.max(0, v));
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return DEFAULT_RANKING_WEIGHTS;
  const [price = 0, duration = 0, stops = 0, baggage = 0, convenience = 0] = values.map((v) => v / total);
  return { price, duration, stops, baggage, convenience };
};

const pickBest = (items: readonly { id: string; value: number }[]): string | undefined =>
  [...items].sort((a, b) => a.value - b.value || a.id.localeCompare(b.id))[0]?.id;

/**
 * Scores and orders offers by the weighted AeroNova score (highest first).
 * All offers must share one currency; mixed-currency sets are a caller bug.
 */
export const rankOffers = (
  offers: readonly FlightOffer[],
  weights: RankingWeights = DEFAULT_RANKING_WEIGHTS,
  thresholds: InsightThresholds = DEFAULT_INSIGHT_THRESHOLDS,
): RankedOffer[] => {
  if (offers.length === 0) return [];
  const currency = offers[0]?.price.currency;
  if (offers.some((o) => o.price.currency !== currency)) {
    throw new RangeError('rankOffers requires offers in a single currency');
  }
  const w = normalizeWeights(weights);
  const rows = offers.map((offer) => ({ offer, metrics: computeOfferMetrics(offer, thresholds) }));

  const prices = rows.map((r) => r.offer.price.customerTotal.amountMinor);
  const durations = rows.map((r) => r.metrics.totalTravelMinutes);
  const stopCounts = rows.map((r) => r.metrics.stops);
  const [pMin, pMax] = [Math.min(...prices), Math.max(...prices)];
  const [dMin, dMax] = [Math.min(...durations), Math.max(...durations)];
  const [sMin, sMax] = [Math.min(...stopCounts), Math.max(...stopCounts)];

  const scored = rows.map(({ offer, metrics }) => {
    const raw =
      w.price * normalizeLowerIsBetter(offer.price.customerTotal.amountMinor, pMin, pMax) +
      w.duration * normalizeLowerIsBetter(metrics.totalTravelMinutes, dMin, dMax) +
      w.stops * normalizeLowerIsBetter(metrics.stops, sMin, sMax) +
      w.baggage * baggageScore(metrics) +
      w.convenience * convenienceScore(metrics);
    return { offer, metrics, score: Math.round(raw * 100) };
  });

  const cheapest = pickBest(
    scored.map((r) => ({ id: r.offer.id, value: r.offer.price.customerTotal.amountMinor })),
  );
  const fastest = pickBest(scored.map((r) => ({ id: r.offer.id, value: r.metrics.totalTravelMinutes })));
  const bestValue = pickBest(
    scored.map((r) => ({ id: r.offer.id, value: r.metrics.pricePerTravelHour.amountMinor })),
  );
  const bestOverall = pickBest(scored.map((r) => ({ id: r.offer.id, value: -r.score })));

  return scored
    .map(({ offer, metrics, score }): RankedOffer => {
      const badges: OfferBadge[] = [];
      if (offer.id === bestOverall) badges.push('best_overall');
      if (offer.id === cheapest) badges.push('cheapest');
      if (offer.id === fastest) badges.push('fastest');
      // "Best value" only adds information when it isn't already the cheapest or best overall.
      if (offer.id === bestValue && offer.id !== cheapest && offer.id !== bestOverall)
        badges.push('best_value');
      const delta = offer.price.customerTotal.amountMinor - pMin;
      return {
        offer,
        metrics,
        score,
        badges,
        comparison: {
          priceDeltaVsCheapest: money(delta, offer.price.currency),
          priceDeltaPercentVsCheapest: pMin === 0 ? 0 : Math.round((delta / pMin) * 100),
          durationDeltaVsFastestMinutes: metrics.totalTravelMinutes - dMin,
        },
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.offer.price.customerTotal.amountMinor - b.offer.price.customerTotal.amountMinor ||
        a.offer.id.localeCompare(b.offer.id),
    );
};
