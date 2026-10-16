export interface Airport {
  readonly iataCode: string;
  readonly icaoCode: string | null;
  readonly name: string;
  readonly cityName: string;
  /** IATA metropolitan code when different from the airport code (LON, PAR, NYC). */
  readonly cityCode: string;
  readonly countryCode: string; // ISO 3166-1 alpha-2
  readonly countryName: string;
  readonly timeZone: string; // IANA
  readonly latitude: number;
  readonly longitude: number;
}

export type LocationKind = 'airport' | 'city';

/** One row in the airport combobox. A city row stands for all its airports. */
export interface LocationSuggestion {
  readonly kind: LocationKind;
  readonly code: string;
  readonly name: string;
  readonly cityName: string;
  readonly countryCode: string;
  readonly countryName: string;
  readonly timeZone: string;
  /** For city rows: the airports included. */
  readonly airportCodes: readonly string[];
}

export interface Airline {
  readonly iataCode: string;
  readonly name: string;
  readonly countryCode: string;
}
