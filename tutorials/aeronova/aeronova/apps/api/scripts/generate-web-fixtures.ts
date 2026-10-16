// Regenerates apps/web/src/test/fixtures from the real mock provider, so web
// tests exercise the exact response shape the API produces.
//   npx tsx apps/api/scripts/generate-web-fixtures.ts
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pino from 'pino';
import { AIRLINES } from '../src/data/airlines.js';
import { AIRPORTS } from '../src/data/airports.js';
import { MockFlightProvider } from '../src/providers/flight/mock/mock-flight-provider.js';
import { AirportDirectory } from '../src/services/airport-directory.js';
import { createDemoCurrencyConverter } from '../src/services/currency-service.js';
import { FlightSearchService } from '../src/services/search/flight-search-service.js';
import { InMemorySearchStore } from '../src/services/search/search-store.js';

const now = () => new Date('2026-09-15T12:00:00Z');
const directory = new AirportDirectory(AIRPORTS, AIRLINES);
const service = new FlightSearchService({
  provider: new MockFlightProvider({ directory, now }),
  directory,
  store: new InMemorySearchStore(),
  fx: createDemoCurrencyConverter(),
  logger: pino({ level: 'silent' }),
  timeoutMs: 5_000,
  now,
});

const fixtures: Record<string, unknown> = {
  'search-dac-lhr.json': {
    tripType: 'one_way',
    cabin: 'economy',
    passengers: { adults: 1, children: 0, infants: 0 },
    journeys: [{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-22' }],
  },
  'search-dac-lhr-return.json': {
    tripType: 'round_trip',
    cabin: 'economy',
    passengers: { adults: 2, children: 1, infants: 0 },
    journeys: [
      { origin: 'DAC', destination: 'LHR', departureDate: '2026-12-22' },
      { origin: 'LHR', destination: 'DAC', departureDate: '2027-01-07' },
    ],
  },
};

for (const [file, raw] of Object.entries(fixtures)) {
  const response = await service.search(service.parseInput(raw), 'fixture');
  const out = resolve(import.meta.dirname, '../../web/src/test/fixtures', file);
  writeFileSync(
    out,
    `${JSON.stringify({ ...response, searchId: 'srch_00000000000000000000000000000000' }, null, 2)}\n`,
  );
  process.stdout.write(`wrote ${response.offers.length} offers to ${out}\n`);
}
