import { describe, expect, it } from 'vitest';
import { AIRLINES } from '../data/airlines.js';
import { AIRPORTS } from '../data/airports.js';
import { AirportDirectory } from './airport-directory.js';

const dir = new AirportDirectory(AIRPORTS, AIRLINES);

describe('AirportDirectory', () => {
  it('has unique, well-formed reference data with valid time zones', () => {
    const codes = AIRPORTS.map((a) => a.iataCode);
    expect(new Set(codes).size).toBe(codes.length);
    for (const a of AIRPORTS) {
      expect(a.iataCode).toMatch(/^[A-Z]{3}$/);
      expect(() => new Intl.DateTimeFormat('en', { timeZone: a.timeZone })).not.toThrow();
      expect(Math.abs(a.latitude)).toBeLessThanOrEqual(90);
    }
  });

  it('finds airports by code, city, name and ignores diacritics and case', () => {
    expect(dir.search('dac')[0]).toMatchObject({ kind: 'airport', code: 'DAC' });
    expect(dir.search('Chattogram')[0]?.code).toBe('CGP');
    expect(dir.search('heathrow')[0]?.code).toBe('LHR');
    expect(dir.search('turkiye').map((s) => s.code)).toContain('IST');
  });

  it('offers a city row first for multi-airport cities', () => {
    const results = dir.search('london');
    expect(results[0]).toMatchObject({ kind: 'city', code: 'LON' });
    expect(results[0]?.airportCodes).toEqual(expect.arrayContaining(['LHR', 'LGW']));
    expect(results.slice(1).every((r) => r.kind === 'airport')).toBe(true);
  });

  it('requires two characters and caps results', () => {
    expect(dir.search('l')).toEqual([]);
    expect(dir.search('an', 3)).toHaveLength(3);
  });

  it('resolves city codes to all their airports and single codes to one', () => {
    expect(dir.resolveLocation('LON').map((a) => a.iataCode)).toEqual(
      expect.arrayContaining(['LHR', 'LGW', 'STN']),
    );
    expect(dir.resolveLocation('CGP').map((a) => a.iataCode)).toEqual(['CGP']);
    expect(dir.resolveLocation('ZZZ')).toEqual([]);
  });

  it('lists nearby airports by distance', () => {
    const near = dir.nearby('LHR');
    expect(near[0]?.airport.cityCode).toBe('LON');
    expect(near.every((n, i) => i === 0 || n.distanceKm >= (near[i - 1]?.distanceKm ?? 0))).toBe(true);
  });

  it('describes airports and multi-airport cities, skipping unknown codes', () => {
    const d = dir.describe(['lon', 'DAC', 'ZZZ', 'DAC']);
    expect(d.LON).toMatchObject({ kind: 'city', cityName: 'London', airportName: null });
    expect(d.DAC).toMatchObject({ kind: 'airport', airportName: 'Hazrat Shahjalal International Airport' });
    expect(Object.keys(d).sort()).toEqual(['DAC', 'LON']);
  });
});
