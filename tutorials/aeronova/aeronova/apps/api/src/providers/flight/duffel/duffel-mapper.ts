import {
  fromDecimalString,
  isCurrencyCode,
  notProvided,
  provided,
  wallTimeToUtc,
  type BaggageAllowance,
  type CabinClass,
  type ConditionValue,
  type CurrencyCode,
  type FareConditions,
  type FlightJourney,
  type FlightOffer,
  type FlightSegment,
  type Layover,
  type Money,
} from '@aeronova/shared';
import { shortHash } from '../../../utils/hash.js';
import type { DuffelOffer, DuffelSegment } from './duffel-schemas.js';

/** ISO 8601 duration ("P1DT2H30M") → whole minutes. */
export const isoDurationMinutes = (value: string | null | undefined): number | undefined => {
  if (!value) return undefined;
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(value);
  if (!m) return undefined;
  const [, d = '0', h = '0', min = '0', s = '0'] = m;
  return Number(d) * 1440 + Number(h) * 60 + Number(min) + Math.round(Number(s) / 60);
};

/** Duffel sends airport-local times without an offset ("2026-12-20T06:20:00"). */
const moment = (local: string, timeZone: string) => {
  const wall = local.slice(0, 16);
  return { local: wall, timeZone, utc: wallTimeToUtc(wall, timeZone).toISOString() };
};

const terminal = (t: string | null | undefined) => (t ? provided(t) : notProvided);

const minutesBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 60_000);

/**
 * Baggage for the offer as a whole: the allowance every segment guarantees for the
 * first passenger. If any segment is silent, the allowance is unknown.
 */
const allowance = (segments: readonly DuffelSegment[], type: 'checked' | 'carry_on'): BaggageAllowance => {
  const quantities: number[] = [];
  for (const s of segments) {
    const bags = s.passengers?.[0]?.baggages;
    if (!bags) return { kind: 'unknown' };
    quantities.push(bags.filter((b) => b.type === type).reduce((n, b) => n + b.quantity, 0));
  }
  const q = Math.min(...quantities);
  return q === 0 ? { kind: 'none' } : { kind: 'pieces', quantity: q, maxWeightKg: notProvided };
};

const condition = (
  c:
    | {
        allowed: boolean;
        penalty_amount?: string | null | undefined;
        penalty_currency?: string | null | undefined;
      }
    | null
    | undefined,
): FareConditions['refund'] => {
  if (!c) return notProvided;
  if (!c.allowed) return provided({ value: 'not_allowed' as ConditionValue, penalty: notProvided });
  const currency = c.penalty_currency;
  if (c.penalty_amount === null || c.penalty_amount === undefined || !currency || !isCurrencyCode(currency)) {
    return provided({ value: 'allowed_fee_unknown' as ConditionValue, penalty: notProvided });
  }
  const penalty = fromDecimalString(c.penalty_amount, currency);
  return penalty.amountMinor === 0
    ? provided({ value: 'allowed' as ConditionValue, penalty: notProvided })
    : provided({ value: 'allowed_with_fee' as ConditionValue, penalty: provided(penalty) });
};

const price = (o: DuffelOffer, currency: CurrencyCode): FlightOffer['price'] => {
  const total = fromDecimalString(o.total_amount, currency);
  const zero: Money = { amountMinor: 0, currency };
  const sameCurrency = (c: string | null | undefined) => c === currency;
  const base =
    o.base_amount && sameCurrency(o.base_currency) ? fromDecimalString(o.base_amount, currency) : undefined;
  const tax =
    o.tax_amount && sameCurrency(o.tax_currency) ? fromDecimalString(o.tax_amount, currency) : undefined;
  const remainder = base ? total.amountMinor - base.amountMinor - (tax?.amountMinor ?? 0) : -1;

  // Only show a split we can prove adds up; otherwise show the total as the fare.
  const consistent = base !== undefined && remainder >= 0;
  return {
    currency,
    base: consistent ? base : total,
    taxes: consistent && tax ? provided(tax) : notProvided,
    fees:
      consistent && remainder > 0
        ? [
            {
              category: 'other',
              label: 'Other supplier charges',
              amount: { amountMinor: remainder, currency },
            },
          ]
        : [],
    supplierTotal: total,
    markup: zero,
    serviceFee: zero,
    discount: zero,
    customerTotal: total,
    // Duffel prices the offer for all passengers together.
    perPassenger: notProvided,
  };
};

const segment = (s: DuffelSegment, id: string, fallbackCabin: CabinClass): FlightSegment => {
  const departure = moment(s.departing_at, s.origin.time_zone);
  const arrival = moment(s.arriving_at, s.destination.time_zone);
  const operating = s.operating_carrier;
  const aircraft = s.aircraft;
  return {
    id,
    marketingCarrier: { code: s.marketing_carrier.iata_code ?? '', name: s.marketing_carrier.name },
    marketingFlightNumber: s.marketing_carrier_flight_number,
    operatingCarrier: operating
      ? provided({ code: operating.iata_code ?? '', name: operating.name })
      : notProvided,
    origin: { iataCode: s.origin.iata_code, terminal: terminal(s.origin_terminal) },
    destination: { iataCode: s.destination.iata_code, terminal: terminal(s.destination_terminal) },
    departure,
    arrival,
    durationMinutes: isoDurationMinutes(s.duration) ?? minutesBetween(departure.utc, arrival.utc),
    aircraft:
      aircraft && (aircraft.iata_code || aircraft.name)
        ? provided({
            code: aircraft.iata_code ?? '',
            name: aircraft.name ? provided(aircraft.name) : notProvided,
          })
        : notProvided,
    cabin: s.passengers?.[0]?.cabin_class ?? fallbackCabin,
    technicalStops: (s.stops ?? []).map((st) => {
      const minutes = isoDurationMinutes(st.duration);
      return {
        airport: { iataCode: st.airport.iata_code, terminal: notProvided },
        durationMinutes: minutes === undefined ? notProvided : provided(minutes),
      };
    }),
  };
};

export type MapResult =
  | { readonly ok: true; readonly offer: FlightOffer }
  | { readonly ok: false; readonly reason: 'unsupported_currency' | 'invalid_data' };

/** Normalizes one Duffel offer. Never throws: bad supplier data becomes a skip reason. */
export const mapDuffelOffer = (o: DuffelOffer, requestedCabin: CabinClass): MapResult => {
  if (!isCurrencyCode(o.total_currency)) return { ok: false, reason: 'unsupported_currency' };
  try {
    const journeys: FlightJourney[] = o.slices.map((slice, j) => {
      const segments = slice.segments.map((s, k) => segment(s, `j${j}s${k}`, requestedCabin));
      const layovers: Layover[] = segments.slice(0, -1).map((cur, k) => {
        const next = segments[k + 1] as FlightSegment;
        const sameAirport = cur.destination.iataCode === next.origin.iataCode;
        const [a, b] = [cur.destination.terminal, next.origin.terminal];
        return {
          afterSegmentId: cur.id,
          beforeSegmentId: next.id,
          airport: cur.destination,
          durationMinutes: minutesBetween(cur.arrival.utc, next.departure.utc),
          requiresAirportChange: !sameAirport,
          requiresTerminalChange:
            sameAirport && a.status === 'provided' && b.status === 'provided'
              ? provided(a.value !== b.value)
              : notProvided,
          // The default offers view only contains single-ticket offers (split tickets
          // appear only in the itineraries view), so connections are protected.
          selfTransfer: provided(false),
        };
      });
      const first = segments[0] as FlightSegment;
      const last = segments[segments.length - 1] as FlightSegment;
      return {
        id: `j${j}`,
        origin: first.origin,
        destination: last.destination,
        segments,
        layovers,
        totalDurationMinutes: minutesBetween(first.departure.utc, last.arrival.utc),
      };
    });

    const allSegments = o.slices.flatMap((s) => s.segments);
    const brand = o.slices[0]?.fare_brand_name;
    const offer: FlightOffer = {
      id: `off_${shortHash(`duffel:${o.id}`)}`,
      itineraryKey: `itn_${shortHash(allSegments.map((s) => `${s.marketing_carrier.iata_code}${s.marketing_carrier_flight_number}@${s.departing_at}`).join('>'))}`,
      dataOrigin: o.live_mode ? 'live' : 'sandbox',
      journeys,
      validatingCarrier: o.owner.iata_code
        ? provided({ code: o.owner.iata_code, name: o.owner.name })
        : notProvided,
      cabin: journeys[0]?.segments[0]?.cabin ?? requestedCabin,
      fareFamily: brand ? provided(brand) : notProvided,
      baggage: { cabin: allowance(allSegments, 'carry_on'), checked: allowance(allSegments, 'checked') },
      conditions: {
        refund: condition(o.conditions?.refund_before_departure),
        change: condition(o.conditions?.change_before_departure),
      },
      price: price(o, o.total_currency),
      seatsRemaining: notProvided,
      expiresAt: provided(o.expires_at),
    };
    return { ok: true, offer };
  } catch {
    return { ok: false, reason: 'invalid_data' };
  }
};
