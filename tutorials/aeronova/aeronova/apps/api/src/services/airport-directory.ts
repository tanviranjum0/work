import type { Airline, Airport, LocationSuggestion, PlaceSummary } from '@aeronova/shared';

const EARTH_RADIUS_KM = 6371;
const toRad = (d: number) => (d * Math.PI) / 180;

export const distanceKm = (a: Airport, b: Airport): number => {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

export interface NearbyAirport {
  readonly airport: Airport;
  readonly distanceKm: number;
}

/**
 * In-memory reference data lookup. Resolves city codes to their airports
 * (LON → LHR, LGW, …) and ranks free-text matches for the combobox.
 */
export class AirportDirectory {
  private readonly byCode = new Map<string, Airport>();
  private readonly byCity = new Map<string, Airport[]>();
  private readonly airlines = new Map<string, Airline>();

  constructor(
    airports: readonly Airport[],
    airlines: readonly Airline[],
    private readonly nearbyRadiusKm = 120,
  ) {
    for (const a of airports) {
      this.byCode.set(a.iataCode, a);
      const list = this.byCity.get(a.cityCode) ?? [];
      list.push(a);
      this.byCity.set(a.cityCode, list);
    }
    for (const al of airlines) this.airlines.set(al.iataCode, al);
  }

  getAirport(code: string): Airport | undefined {
    return this.byCode.get(code.toUpperCase());
  }

  getAirline(code: string): Airline | undefined {
    return this.airlines.get(code.toUpperCase());
  }

  /**
   * A searchable location code is either a metropolitan city code with several
   * airports (LON, NYC, PAR, BKK) or a single airport code.
   */
  resolveLocation(code: string): readonly Airport[] {
    const upper = code.toUpperCase();
    const city = this.byCity.get(upper);
    if (city && city.length > 1) return city;
    const airport = this.byCode.get(upper);
    return airport ? [airport] : [];
  }

  /** Display names for a set of codes; unknown codes are simply omitted. */
  describe(codes: Iterable<string>): Record<string, PlaceSummary> {
    const out: Record<string, PlaceSummary> = {};
    for (const raw of codes) {
      const code = raw.toUpperCase();
      if (out[code]) continue;
      const airports = this.resolveLocation(code);
      const first = airports[0];
      if (!first) continue;
      const isCity = airports.length > 1;
      out[code] = {
        code,
        kind: isCity ? 'city' : 'airport',
        cityName: first.cityName,
        airportName: isCity ? null : first.name,
        countryName: first.countryName,
        timeZone: first.timeZone,
      };
    }
    return out;
  }

  nearby(code: string): NearbyAirport[] {
    const origin = this.byCode.get(code.toUpperCase());
    if (!origin) return [];
    return [...this.byCode.values()]
      .filter((a) => a.iataCode !== origin.iataCode)
      .map((airport) => ({ airport, distanceKm: Math.round(distanceKm(origin, airport)) }))
      .filter((n) => n.distanceKm <= this.nearbyRadiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  search(rawQuery: string, limit = 8): LocationSuggestion[] {
    const q = fold(rawQuery);
    if (q.length < 2) return [];
    const upper = q.toUpperCase();
    const scored = new Map<string, { s: LocationSuggestion; score: number }>();
    const add = (s: LocationSuggestion, score: number) => {
      const key = `${s.kind}:${s.code}`;
      const prev = scored.get(key);
      if (!prev || prev.score < score) scored.set(key, { s, score });
    };

    for (const [cityCode, airports] of this.byCity) {
      if (airports.length < 2) continue;
      const first = airports[0];
      if (!first) continue;
      const city = fold(first.cityName);
      const score = cityCode === upper ? 100 : city.startsWith(q) ? 90 : 0;
      if (score > 0) {
        add(
          {
            kind: 'city',
            code: cityCode,
            name: `${first.cityName} (all airports)`,
            cityName: first.cityName,
            countryCode: first.countryCode,
            countryName: first.countryName,
            timeZone: first.timeZone,
            airportCodes: airports.map((a) => a.iataCode),
          },
          score,
        );
      }
    }

    for (const a of this.byCode.values()) {
      const name = fold(a.name);
      const city = fold(a.cityName);
      const country = fold(a.countryName);
      let score = 0;
      if (a.iataCode === upper) score = 95;
      else if (city.startsWith(q)) score = 80;
      else if (name.split(/\s+/).some((w) => w.startsWith(q))) score = 60;
      else if (country.startsWith(q) || a.countryCode.toLowerCase() === q) score = 40;
      else if (name.includes(q) || city.includes(q)) score = 20;
      if (score > 0) {
        add(
          {
            kind: 'airport',
            code: a.iataCode,
            name: a.name,
            cityName: a.cityName,
            countryCode: a.countryCode,
            countryName: a.countryName,
            timeZone: a.timeZone,
            airportCodes: [a.iataCode],
          },
          score,
        );
      }
    }

    return [...scored.values()]
      .sort(
        (x, y) =>
          y.score - x.score ||
          (x.s.kind === y.s.kind ? 0 : x.s.kind === 'city' ? -1 : 1) ||
          x.s.cityName.localeCompare(y.s.cityName) ||
          x.s.code.localeCompare(y.s.code),
      )
      .slice(0, limit)
      .map((r) => r.s);
  }
}
