import {
  daysBetween,
  fromDecimalString,
  money,
  notProvided,
  provided,
  todayInTimeZone,
  toCalendarDate,
  utcToWallTime,
  wallTimeToUtc,
  type AirportRef,
  type CabinClass,
  type FareConditions,
  type FeeCategory,
  type FlightJourney,
  type FlightOffer,
  type FlightSearchInput,
  type FlightSegment,
  type Layover,
  type Money,
  type PassengerPriceLine,
} from '@aeronova/shared';
import type { AirportDirectory } from '../../../services/airport-directory.js';
import { AIRCRAFT_NAMES } from '../../../data/airlines.js';
import { fnv1a, shortHash } from '../../../utils/hash.js';
import type {
  FlightProvider,
  ProviderBoundOffer,
  ProviderContext,
  ProviderOfferRef,
  ProviderPriceResult,
  ProviderSearchResult,
} from '../flight-provider.js';
import {
  AIRPORT_FEE_USD_PER_JOURNEY,
  fareFamiliesFor,
  PASSENGER_FARE_RATIO,
  PASSENGER_TAX_RATIO,
  TAX_RATE,
  type FareFamilySpec,
} from './fares.js';
import { SCHEDULE, type ScheduleTemplate } from './schedules.js';

const USD = 'USD' as const;
/** One in this many offers moves up in price when re-checked, so the price-change flow is demonstrable. */
export const MOCK_PRICE_CHANGE_ONE_IN = 4;
export const MOCK_PRICE_CHANGE_BPS = 300; // +3%
const QUOTE_TTL_MINUTES = 20;
const MAX_COMBINATIONS_PER_CARRIER = 6;
const OFFER_TTL_MINUTES = 30;
const usd = (whole: number): Money => fromDecimalString(String(Math.round(whole)), USD);

export interface MockFlightProviderOptions {
  readonly directory: AirportDirectory;
  readonly schedule?: readonly ScheduleTemplate[];
  readonly now?: () => Date;
  /** Artificial latency so loading states are visible in demo mode. */
  readonly latencyMs?: number;
}

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (ms <= 0) return resolve();
    const t = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(t);
        reject(signal.reason);
      },
      { once: true },
    );
  });

const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

/**
 * Deterministic demo supplier. Same input and same day → same offers.
 * Prices vary by route, date and booking window through a stable hash, never
 * through Math.random().
 */
export class MockFlightProvider implements FlightProvider {
  readonly id = 'mock' as const;
  readonly capabilities = { flexibleDates: true } as const;
  private readonly schedule: readonly ScheduleTemplate[];
  private readonly now: () => Date;

  constructor(private readonly opts: MockFlightProviderOptions) {
    this.schedule = opts.schedule ?? SCHEDULE;
    this.now = opts.now ?? (() => new Date());
  }

  async searchFlights(input: FlightSearchInput, ctx: ProviderContext): Promise<ProviderSearchResult> {
    await sleep(this.opts.latencyMs ?? 0, ctx.signal);
    ctx.signal.throwIfAborted();

    const candidates = input.journeys.map((j) =>
      this.candidatesFor(j.origin, j.destination, j.departureDate, input),
    );
    const now = this.now();
    const expiresAt = new Date(now.getTime() + OFFER_TTL_MINUTES * 60_000).toISOString();
    if (candidates.some((c) => c.length === 0)) return { offers: [], dataOrigin: 'demo', expiresAt };

    const offers: ProviderBoundOffer[] = [];
    for (const combo of this.combine(candidates)) {
      const first = combo[0];
      if (!first) continue;
      for (const family of fareFamiliesFor(first.fareSet, input.cabin)) {
        offers.push(this.buildOffer(combo, family, input, now));
      }
    }
    offers.sort(
      (a, b) =>
        a.offer.price.customerTotal.amountMinor - b.offer.price.customerTotal.amountMinor ||
        a.offer.id.localeCompare(b.offer.id),
    );
    return { offers, dataOrigin: 'demo', expiresAt };
  }

  /**
   * Deterministic demo rules, documented so demos are predictable:
   * - past the offer's expiry → unavailable (expired)
   * - offers whose reference hashes to 0 mod MOCK_PRICE_CHANGE_ONE_IN → +3% per traveller
   * - everything else → confirmed at the same price
   */
  async priceOffer(
    ref: ProviderOfferRef,
    known: FlightOffer,
    ctx: ProviderContext,
  ): Promise<ProviderPriceResult> {
    await sleep(Math.round((this.opts.latencyMs ?? 0) * 0.6), ctx.signal);
    ctx.signal.throwIfAborted();
    const now = this.now();
    if (known.expiresAt.status === 'provided' && Date.parse(known.expiresAt.value) <= now.getTime()) {
      return { kind: 'unavailable', reason: 'expired' };
    }
    const expiresAt = new Date(now.getTime() + QUOTE_TTL_MINUTES * 60_000).toISOString();
    const offer =
      fnv1a(ref.providerOfferId) % MOCK_PRICE_CHANGE_ONE_IN === 0
        ? raisePrice(known, MOCK_PRICE_CHANGE_BPS)
        : known;
    return { kind: 'priced', offer: { ...offer, expiresAt: provided(expiresAt) }, expiresAt };
  }

  private candidatesFor(origin: string, destination: string, date: string, input: FlightSearchInput) {
    const from = new Set(this.opts.directory.resolveLocation(origin).map((a) => a.iataCode));
    const to = new Set(this.opts.directory.resolveLocation(destination).map((a) => a.iataCode));
    const day = weekday(date);
    return this.schedule.filter((t) => {
      const firstSeg = t.segments[0];
      const lastSeg = t.segments[t.segments.length - 1];
      if (!firstSeg || !lastSeg) return false;
      if (!from.has(firstSeg.from) || !to.has(lastSeg.to)) return false;
      if (!t.cabins.includes(input.cabin)) return false;
      if (t.operatesOn && !t.operatesOn.includes(day)) return false;
      if (input.directOnly && (t.segments.length > 1 || t.segments.some((s) => s.technicalStop)))
        return false;
      return true;
    });
  }

  /** Multi-journey trips are combined within one ticketing carrier, as a single fare would be. */
  private *combine(candidates: readonly (readonly ScheduleTemplate[])[]): Generator<ScheduleTemplate[]> {
    const key = (t: ScheduleTemplate) => t.validatingCarrier ?? '(self-transfer)';
    const carriers = new Set((candidates[0] ?? []).map(key));
    for (const carrier of [...carriers].sort()) {
      const perJourney = candidates.map((c) => c.filter((t) => key(t) === carrier));
      if (perJourney.some((c) => c.length === 0)) continue;
      let produced = 0;
      const walk = function* (i: number, acc: ScheduleTemplate[]): Generator<ScheduleTemplate[]> {
        if (produced >= MAX_COMBINATIONS_PER_CARRIER) return;
        if (i === perJourney.length) {
          produced++;
          yield acc;
          return;
        }
        for (const t of perJourney[i] ?? []) yield* walk(i + 1, [...acc, t]);
      };
      yield* walk(0, []);
    }
  }

  private buildOffer(
    combo: readonly ScheduleTemplate[],
    family: FareFamilySpec,
    input: FlightSearchInput,
    now: Date,
  ): ProviderBoundOffer {
    const journeys = combo.map((t, i) =>
      this.buildJourney(t, input.journeys[i]?.departureDate ?? '', i, input.cabin),
    );
    const dates = input.journeys.map((j) => j.departureDate).join(',');
    const pax = input.passengers;
    const providerOfferId = `${combo.map((t) => t.id).join('+')}@${dates}#${family.name}#${input.cabin}#${pax.adults}-${pax.children}-${pax.infants}`;

    // Per-adult components in whole USD.
    const today = todayInTimeZone('UTC', now);
    const adultBase = combo.reduce((sum, t, i) => {
      const date = input.journeys[i]?.departureDate ?? today;
      const hashFactor = 0.9 + (fnv1a(`${t.id}|${date}`) % 26) / 100; // 0.90–1.15
      const daysOut = daysBetween(today, toCalendarDate(date));
      const windowFactor = daysOut < 14 ? 1.12 : daysOut < 30 ? 1.05 : 1;
      return sum + t.baseFareUsd * family.multiplier * hashFactor * windowFactor;
    }, 0);
    const surcharge = combo.reduce(
      (s, t) => s + t.carrierSurchargeUsd * (input.cabin === 'economy' ? 1 : 1.5),
      0,
    );
    const airportFee = AIRPORT_FEE_USD_PER_JOURNEY * combo.length;

    const unit = (type: 'adult' | 'child' | 'infant') => {
      const base = Math.round(adultBase * PASSENGER_FARE_RATIO[type]);
      const tax = Math.round(adultBase * TAX_RATE * PASSENGER_TAX_RATIO[type]);
      const sur = type === 'infant' ? 0 : Math.round(surcharge);
      const apt = type === 'infant' ? 0 : airportFee;
      return { base, tax, sur, apt, total: base + tax + sur + apt };
    };
    const lines = (['adult', 'child', 'infant'] as const)
      .map((type) => ({
        type,
        count: type === 'adult' ? pax.adults : type === 'child' ? pax.children : pax.infants,
        u: unit(type),
      }))
      .filter((l) => l.count > 0);

    const total = (pick: (u: ReturnType<typeof unit>) => number) =>
      usd(lines.reduce((s, l) => s + pick(l.u) * l.count, 0));
    const base = total((u) => u.base);
    const taxes = total((u) => u.tax);
    const fees: { category: FeeCategory; label: string; amount: Money }[] = [];
    const surTotal = total((u) => u.sur);
    const aptTotal = total((u) => u.apt);
    if (surTotal.amountMinor > 0)
      fees.push({ category: 'carrier_surcharge', label: 'Carrier-imposed surcharge', amount: surTotal });
    if (aptTotal.amountMinor > 0)
      fees.push({ category: 'airport_fee', label: 'Airport and security fees', amount: aptTotal });
    const supplierTotal = money(
      base.amountMinor + taxes.amountMinor + surTotal.amountMinor + aptTotal.amountMinor,
      USD,
    );
    const zero = money(0, USD);

    const perPassenger: PassengerPriceLine[] = lines.map((l) => ({
      passengerType: l.type,
      count: l.count,
      unitTotal: usd(l.u.total),
    }));
    const validating = combo[0]?.validatingCarrier;
    const validatingAirline = validating ? this.opts.directory.getAirline(validating) : undefined;

    const offer: FlightOffer = {
      id: `off_${shortHash(providerOfferId)}`,
      itineraryKey: `itn_${shortHash(journeys.map((j) => j.segments.map((s) => `${s.marketingCarrier.code}${s.marketingFlightNumber}@${s.departure.local}`).join('>')).join('|'))}`,
      dataOrigin: 'demo',
      journeys,
      validatingCarrier: validatingAirline
        ? provided({ code: validatingAirline.iataCode, name: validatingAirline.name })
        : notProvided,
      cabin: input.cabin,
      fareFamily: provided(family.name),
      baggage: { cabin: family.cabinBag, checked: family.checkedBag },
      conditions: this.conditions(family),
      price: {
        currency: USD,
        base,
        taxes: provided(taxes),
        fees,
        supplierTotal,
        markup: zero,
        serviceFee: zero,
        discount: zero,
        customerTotal: supplierTotal,
        perPassenger: provided(perPassenger),
      },
      // The demo supplier does not publish inventory, so no urgency claims are possible.
      seatsRemaining: notProvided,
      expiresAt: provided(new Date(now.getTime() + OFFER_TTL_MINUTES * 60_000).toISOString()),
    };
    return { offer, ref: { provider: 'mock', providerOfferId } };
  }

  private conditions(family: FareFamilySpec): FareConditions {
    const map = (c: FareFamilySpec['refund']) =>
      c === undefined
        ? notProvided
        : provided({
            value: c.value,
            penalty: c.penaltyUsd !== undefined ? provided(usd(c.penaltyUsd)) : notProvided,
          });
    return { refund: map(family.refund), change: map(family.change) };
  }

  private airportRef(code: string, terminal: string | undefined): AirportRef {
    return { iataCode: code, terminal: terminal ? provided(terminal) : notProvided };
  }

  private buildJourney(
    t: ScheduleTemplate,
    date: string,
    journeyIndex: number,
    cabin: CabinClass,
  ): FlightJourney {
    const segments: FlightSegment[] = [];
    const layovers: Layover[] = [];
    let departureWall = `${date}T${t.departs}`;

    t.segments.forEach((spec, k) => {
      const fromAirport = this.opts.directory.getAirport(spec.from);
      const toAirport = this.opts.directory.getAirport(spec.to);
      if (!fromAirport || !toAirport) throw new Error(`Mock schedule references unknown airport in ${t.id}`);

      const depUtc = wallTimeToUtc(departureWall, fromAirport.timeZone);
      const arrUtc = new Date(depUtc.getTime() + spec.blockMinutes * 60_000);
      const carrier = this.opts.directory.getAirline(spec.carrier);
      const operator = spec.operatedBy ? this.opts.directory.getAirline(spec.operatedBy) : carrier;
      if (!carrier || !operator) throw new Error(`Mock schedule references unknown airline in ${t.id}`);
      const aircraftName = spec.aircraft ? AIRCRAFT_NAMES[spec.aircraft] : undefined;

      const segment: FlightSegment = {
        id: `j${journeyIndex}s${k}`,
        marketingCarrier: { code: carrier.iataCode, name: carrier.name },
        marketingFlightNumber: spec.number,
        operatingCarrier: provided({ code: operator.iataCode, name: operator.name }),
        origin: this.airportRef(spec.from, spec.departureTerminal),
        destination: this.airportRef(spec.to, spec.arrivalTerminal),
        departure: { local: departureWall, timeZone: fromAirport.timeZone, utc: depUtc.toISOString() },
        arrival: {
          local: utcToWallTime(arrUtc, toAirport.timeZone),
          timeZone: toAirport.timeZone,
          utc: arrUtc.toISOString(),
        },
        durationMinutes: spec.blockMinutes,
        aircraft: spec.aircraft
          ? provided({ code: spec.aircraft, name: aircraftName ? provided(aircraftName) : notProvided })
          : notProvided,
        cabin,
        technicalStops: spec.technicalStop
          ? [
              {
                airport: this.airportRef(spec.technicalStop.airport, undefined),
                durationMinutes: provided(spec.technicalStop.minutes),
              },
            ]
          : [],
      };
      segments.push(segment);

      const next = t.segments[k + 1];
      if (next) {
        const connection = spec.connectionMinutes ?? 90;
        const nextAirport = this.opts.directory.getAirport(next.from);
        if (!nextAirport) throw new Error(`Mock schedule references unknown airport in ${t.id}`);
        const nextDep = new Date(arrUtc.getTime() + connection * 60_000);
        departureWall = utcToWallTime(nextDep, nextAirport.timeZone);
        const sameAirport = spec.to === next.from;
        layovers.push({
          afterSegmentId: segment.id,
          beforeSegmentId: `j${journeyIndex}s${k + 1}`,
          airport: this.airportRef(spec.to, spec.arrivalTerminal),
          durationMinutes: connection,
          requiresAirportChange: !sameAirport,
          requiresTerminalChange:
            sameAirport && spec.arrivalTerminal && next.departureTerminal
              ? provided(spec.arrivalTerminal !== next.departureTerminal)
              : notProvided,
          selfTransfer: provided(Boolean(t.selfTransfer)),
        });
      }
    });

    const firstSeg = segments[0];
    const lastSeg = segments[segments.length - 1];
    if (!firstSeg || !lastSeg) throw new Error(`Empty template ${t.id}`);
    return {
      id: `j${journeyIndex}`,
      origin: firstSeg.origin,
      destination: lastSeg.destination,
      segments,
      layovers,
      totalDurationMinutes: Math.round(
        (Date.parse(lastSeg.arrival.utc) - Date.parse(firstSeg.departure.utc)) / 60_000,
      ),
    };
  }
}

/**
 * Raises every traveller's fare by `bps` basis points (rounded to whole major
 * units) and keeps the breakdown summing exactly: the increase goes to base fare.
 */
export const raisePrice = (offer: FlightOffer, bps: number): FlightOffer => {
  const p = offer.price;
  if (p.perPassenger.status !== 'provided') return offer;
  const unit = 10 ** (p.currency === 'JPY' ? 0 : 2);
  const lines = p.perPassenger.value.map((l) => {
    const delta = Math.max(unit, Math.round((l.unitTotal.amountMinor * bps) / 10_000 / unit) * unit);
    return {
      line: { ...l, unitTotal: money(l.unitTotal.amountMinor + delta, p.currency) },
      total: delta * l.count,
    };
  });
  const increase = lines.reduce((s, l) => s + l.total, 0);
  const bump = (m: Money) => money(m.amountMinor + increase, m.currency);
  return {
    ...offer,
    price: {
      ...p,
      base: bump(p.base),
      supplierTotal: bump(p.supplierTotal),
      customerTotal: bump(p.customerTotal),
      perPassenger: provided(lines.map((l) => l.line)),
    },
  };
};
