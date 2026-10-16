import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { Booking, FlightOffer } from '@aeronova/shared';
import { countPdfPages, extractPdfText } from '../../test-support-pdf.js';
import { renderItineraryPdf } from './itinerary-pdf.js';

// Real offer data from the mock provider (via a generated search fixture), not
// hand-typed, so the document is exercised against the actual shapes the app
// produces (technical stops, layovers, MaybeProvided fields and all).
const fixtureUrl = new URL('../../../../web/src/test/fixtures/search-dac-lhr-return.json', import.meta.url);
const fixture = JSON.parse(readFileSync(fileURLToPath(fixtureUrl), 'utf8')) as {
  offers: { offer: FlightOffer }[];
};
const offer = fixture.offers[0]!.offer;

const passenger = (
  overrides: Partial<Booking['passengers'][number]> = {},
): Booking['passengers'][number] => ({
  id: 'p1',
  type: 'adult',
  title: 'mr',
  givenName: 'Tanvir',
  middleName: null,
  familyName: 'Anjum',
  dateOfBirth: '1995-03-14',
  gender: null,
  nationality: 'BD',
  travelDocument: { type: 'passport', number: 'BD1234567', issuingCountry: 'BD', expiryDate: '2031-01-01' },
  loyaltyNumber: null,
  ...overrides,
});

const booking = (overrides: Partial<Booking> = {}): Booking => ({
  id: 'b1',
  reference: 'HVL922',
  userId: 'u1',
  state: 'TICKETED',
  currency: 'USD',
  total: offer.price.customerTotal,
  passengers: [passenger()],
  contact: { email: 'tanvir@example.com', phone: '+8801700000000' },
  snapshot: { offer, capturedAt: '2026-09-19T10:00:00.000Z', dataOrigin: 'demo' },
  payment: null,
  tickets: [
    {
      id: 't1',
      passengerId: 'p1',
      number: 'DEMO-7QK2XP-01',
      state: 'ISSUED',
      issuedAt: '2026-09-19T10:01:00.000Z',
      simulated: true,
    },
  ],
  history: [],
  simulated: true,
  createdAt: '2026-09-19T10:01:00.000Z',
  updatedAt: '2026-09-19T10:01:00.000Z',
  ...overrides,
});

describe('renderItineraryPdf', () => {
  it('produces a real, well-formed PDF', async () => {
    const buf = await renderItineraryPdf(booking());
    expect(buf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    // %%EOF is the raw file's trailer marker, not visible page text — check
    // the buffer itself for it, confirming the file isn't truncated.
    expect(buf.subarray(-2048).toString('latin1')).toContain('%%EOF');
    expect(buf.length).toBeGreaterThan(1000);
  });

  it('includes the reference, flights, traveller and price, all from the snapshot', async () => {
    const text = await extractPdfText(await renderItineraryPdf(booking()));
    expect(text).toContain('HVL922');
    expect(text).toContain(offer.journeys[0]!.segments[0]!.origin.iataCode);
    expect(text).toContain(offer.journeys[0]!.segments[0]!.marketingCarrier.name);
    expect(text).toContain('Tanvir Anjum');
    expect(text).toContain('$5,231.00'); // this fixture's known total
    expect(text).toContain('DEMO-7QK2XP-01');
  });

  it("never renders the Unicode arrow pdfkit's standard fonts cannot encode", async () => {
    // Regression: WinAnsiEncoding has no glyph for U+2192 and silently maps
    // it to something else, producing garbled text with no error raised.
    const text = await extractPdfText(await renderItineraryPdf(booking()));
    expect(text).not.toContain('\u2192');
  });

  it('marks a simulated booking and its tickets plainly, and omits that marking otherwise', async () => {
    const demo = await extractPdfText(await renderItineraryPdf(booking()));
    expect(demo).toContain('DEMO RESERVATION');
    expect(demo).toContain('DEMO TICKET');

    const real = await extractPdfText(
      await renderItineraryPdf(
        booking({
          simulated: false,
          tickets: [
            {
              id: 't1',
              passengerId: 'p1',
              number: 'BG1234567890',
              state: 'ISSUED',
              issuedAt: '2026-09-19T10:01:00.000Z',
              simulated: false,
            },
          ],
        }),
      ),
    );
    expect(real).not.toContain('DEMO RESERVATION');
    expect(real).not.toContain('DEMO TICKET');
  });

  it('never includes a passport number or date of birth, even though the booking record holds them', async () => {
    const text = await extractPdfText(await renderItineraryPdf(booking()));
    expect(text).not.toContain('BD1234567');
    expect(text).not.toContain('1995-03-14');
    expect(text).not.toContain('1995');
  });

  it('never includes contact details, even though the booking record holds them', async () => {
    const text = await extractPdfText(await renderItineraryPdf(booking()));
    expect(text).not.toContain('tanvir@example.com');
    expect(text).not.toContain('+8801700000000');
  });

  it('flows onto a second page for a long booking instead of overlapping the footer with content', async () => {
    const many = booking({
      passengers: Array.from({ length: 9 }, (_, i) => passenger({ id: `p${i}`, familyName: `Number${i}` })),
      tickets: Array.from({ length: 9 }, (_, i) => ({
        id: `t${i}`,
        passengerId: `p${i}`,
        number: `DEMO-LONGBOOK-${String(i).padStart(2, '0')}`,
        state: 'ISSUED' as const,
        issuedAt: '2026-09-19T10:01:00.000Z',
        simulated: true,
      })),
    });
    const buf = await renderItineraryPdf(many);
    expect(await countPdfPages(buf)).toBeGreaterThan(1);
    const text = await extractPdfText(buf);
    expect(text).toContain('DEMO-LONGBOOK-08');
    expect(text).toContain('licensed travel agency'); // footer still present, not clipped off
  });

  it('renders an itinerary with a technical stop and a layover without throwing', async () => {
    // Exercises journeys.segments[].technicalStops and layovers together, not
    // just the simplest one-segment case.
    const techStopOffer = fixture.offers.find((o) =>
      o.offer.journeys.some((j) => j.segments.some((s) => s.technicalStops.length > 0)),
    );
    const target = techStopOffer?.offer ?? offer;
    const buf = await renderItineraryPdf(
      booking({ snapshot: { offer: target, capturedAt: '2026-09-19T10:00:00.000Z', dataOrigin: 'demo' } }),
    );
    expect(buf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
  });

  it('omits the fare-conditions penalty amount when the supplier did not provide one', async () => {
    const noFeeOffer: FlightOffer = {
      ...offer,
      conditions: {
        refund: { status: 'not_provided' },
        change: {
          status: 'provided',
          value: { value: 'allowed_fee_unknown', penalty: { status: 'not_provided' } },
        },
      },
    };
    const text = await extractPdfText(
      await renderItineraryPdf(
        booking({
          snapshot: { offer: noFeeOffer, capturedAt: '2026-09-19T10:00:00.000Z', dataOrigin: 'demo' },
        }),
      ),
    );
    expect(text).toContain('Refund: Not provided');
    expect(text).toContain('Change: Allowed, fee not provided');
  });
});
