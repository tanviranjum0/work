import { createFlightSearchInputSchema, toCalendarDate } from '@aeronova/shared';
import pino from 'pino';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../../../errors/app-error.js';
import { offerNoLongerAvailable, offerRequestResponse, directOffer } from './__fixtures__/offer-request.js';
import { DuffelClient, DuffelError, DUFFEL_API_VERSION } from './duffel-client.js';
import {
  DuffelFlightProvider,
  REPRESENTATIVE_CHILD_AGE,
  REPRESENTATIVE_INFANT_AGE,
} from './duffel-flight-provider.js';
import { duffelOfferEnvelope, duffelOfferRequestEnvelope } from './duffel-schemas.js';

const TOKEN = 'duffel_test_SECRET_TOKEN_123';
const logger = pino({ level: 'silent' });

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });

type FetchArgs = [URL, RequestInit];

const setup = (...responses: (Response | Error)[]) => {
  const fetchImpl = vi.fn(async (..._args: FetchArgs) => {
    const next = responses.shift();
    if (!next) throw new Error('unexpected extra request');
    if (next instanceof Error) throw next;
    return next;
  });
  const client = new DuffelClient({
    accessToken: TOKEN,
    logger,
    fetchImpl: fetchImpl as unknown as typeof fetch,
  });
  const provider = new DuffelFlightProvider({ client, logger, supplierTimeoutMs: 18_000 });
  return { fetchImpl, client, provider };
};

const input = createFlightSearchInputSchema({ today: toCalendarDate('2026-09-16') }).parse({
  tripType: 'one_way',
  cabin: 'economy',
  passengers: { adults: 2, children: 1, infants: 1 },
  journeys: [{ origin: 'LON', destination: 'NYC', departureDate: '2026-12-20' }],
});
const ctx = () => ({ signal: new AbortController().signal, requestId: 'req-local-1' });

describe('DuffelClient', () => {
  it('sends the pinned version, auth and correlation headers', async () => {
    const { fetchImpl, client } = setup(json({ data: {} }, 200, { 'x-request-id': 'dfl-1' }));
    await client.request({
      method: 'GET',
      path: '/air/offers/off_1',
      signal: ctx().signal,
      requestId: 'req-9',
      schema: duffelOfferEnvelope,
    });
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(String(url)).toBe('https://api.duffel.com/air/offers/off_1');
    expect(init.headers).toMatchObject({
      'Duffel-Version': DUFFEL_API_VERSION,
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
      'x-client-correlation-id': 'req-9',
    });
    expect(DUFFEL_API_VERSION).toBe('v2');
  });

  it('classifies failures and never puts the token in the error', async () => {
    const cases: [Response, string][] = [
      [json({ errors: [{ code: 'rate_limit_exceeded' }] }, 429), 'rate_limited'],
      [json({ errors: [] }, 401), 'unauthorized'],
      [json(offerNoLongerAvailable, 422), 'offer_unavailable'],
      [json({ errors: [{ code: 'validation_error' }] }, 422), 'invalid_request'],
      [json({ errors: [{ code: 'airline_internal' }] }, 504), 'timeout'],
      [new Response('<html>bad gateway</html>', { status: 502 }), 'unavailable'],
    ];
    for (const [res, kind] of cases) {
      const { client } = setup(res);
      const err = await client
        .request({
          method: 'GET',
          path: '/x',
          signal: ctx().signal,
          requestId: 'r',
          schema: duffelOfferEnvelope,
        })
        .catch((e: unknown) => e as DuffelError);
      expect(err).toBeInstanceOf(DuffelError);
      expect((err as DuffelError).kind).toBe(kind);
      expect(JSON.stringify({ m: (err as Error).message, e: err })).not.toContain(TOKEN);
    }
  });

  it('retries a gateway error once when allowed, and not otherwise', async () => {
    const ok = json({ data: {} });
    const { fetchImpl, client } = setup(new Response('', { status: 503 }), ok);
    await client.request({
      method: 'GET',
      path: '/x',
      signal: ctx().signal,
      requestId: 'r',
      schema: duffelOfferEnvelope,
      attempts: 2,
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);

    const single = setup(new Response('', { status: 503 }), json({ data: {} }));
    await expect(
      single.client.request({
        method: 'GET',
        path: '/x',
        signal: ctx().signal,
        requestId: 'r',
        schema: duffelOfferEnvelope,
      }),
    ).rejects.toMatchObject({ kind: 'unavailable' });
    expect(single.fetchImpl).toHaveBeenCalledTimes(1);

    const rateLimited = setup(json({}, 429), json({ data: {} }));
    await expect(
      rateLimited.client.request({
        method: 'GET',
        path: '/x',
        signal: ctx().signal,
        requestId: 'r',
        schema: duffelOfferEnvelope,
        attempts: 3,
      }),
    ).rejects.toMatchObject({ kind: 'rate_limited' });
    expect(rateLimited.fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('reports aborted requests as timeouts and bad payloads as malformed', async () => {
    const ac = new AbortController();
    ac.abort();
    const aborted = setup(new DOMException('aborted', 'AbortError'));
    await expect(
      aborted.client.request({
        method: 'GET',
        path: '/x',
        signal: ac.signal,
        requestId: 'r',
        schema: duffelOfferEnvelope,
      }),
    ).rejects.toMatchObject({ kind: 'timeout' });

    const junk = setup(json({ unexpected: true }));
    await expect(
      junk.client.request({
        method: 'POST',
        path: '/x',
        body: {},
        signal: ctx().signal,
        requestId: 'r',
        schema: duffelOfferRequestEnvelope,
      }),
    ).rejects.toMatchObject({ kind: 'malformed_response' });
  });
});

describe('DuffelFlightProvider', () => {
  it('builds the offer request Duffel documents', async () => {
    const { fetchImpl, provider } = setup(json(offerRequestResponse));
    await provider.searchFlights(input, ctx());
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url.pathname).toBe('/air/offer_requests');
    expect(url.searchParams.get('return_offers')).toBe('true');
    expect(url.searchParams.get('supplier_timeout')).toBe('18000');
    expect(JSON.parse(String(init.body))).toEqual({
      data: {
        slices: [{ origin: 'LON', destination: 'NYC', departure_date: '2026-12-20' }],
        passengers: [
          { type: 'adult' },
          { type: 'adult' },
          { age: REPRESENTATIVE_CHILD_AGE },
          { age: REPRESENTATIVE_INFANT_AGE },
        ],
        cabin_class: 'economy',
        max_connections: 1,
      },
    });
    const direct = setup(json(offerRequestResponse));
    await direct.provider.searchFlights({ ...input, directOnly: true }, ctx());
    expect(JSON.parse(String(direct.fetchImpl.mock.calls[0]![1].body)).data.max_connections).toBe(0);
  });

  it('returns normalized sandbox offers in one currency, skipping what it cannot represent', async () => {
    const { provider } = setup(json(offerRequestResponse));
    const res = await provider.searchFlights(input, ctx());
    expect(res.dataOrigin).toBe('sandbox');
    // direct, connecting, technical stop; CHF unsupported, EUR differs, malformed skipped.
    expect(res.offers.map((b) => b.ref.providerOfferId)).toEqual([
      'off_direct',
      'off_connecting',
      'off_techstop',
    ]);
    expect(new Set(res.offers.map((b) => b.offer.price.currency))).toEqual(new Set(['GBP']));
    expect(res.offers.every((b) => b.ref.provider === 'duffel')).toBe(true);
    // Result set expires with its earliest offer.
    expect(res.expiresAt).toBe('2026-09-16T10:20:00.000Z');
    expect(provider.capabilities.flexibleDates).toBe(false);
  });

  it('turns supplier failures into stable, traveller-safe errors', async () => {
    const limited = setup(json({ errors: [{ code: 'rate_limit_exceeded' }] }, 429));
    const err = (await limited.provider.searchFlights(input, ctx()).catch((e: unknown) => e)) as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err).toMatchObject({ code: 'FLIGHT_PROVIDER_RATE_LIMIT', httpStatus: 503 });
    expect(err.publicMessage).not.toMatch(/duffel/i);

    const slow = setup(json({}, 504));
    await expect(slow.provider.searchFlights(input, ctx())).rejects.toMatchObject({
      code: 'FLIGHT_PROVIDER_TIMEOUT',
    });

    const denied = setup(json({}, 401));
    await expect(denied.provider.searchFlights(input, ctx())).rejects.toMatchObject({
      code: 'FLIGHT_PROVIDER_UNAVAILABLE',
    });
  });

  it('reprices an offer, keeping the AeroNova ids, and reports expiry', async () => {
    const { provider: first } = setup(json(offerRequestResponse));
    const known = (await first.searchFlights(input, ctx())).offers[0]!;

    const repriced = { ...directOffer, total_amount: '262.00', expires_at: '2026-09-16T11:00:00Z' };
    const { fetchImpl, provider } = setup(json({ data: repriced }));
    const result = await provider.priceOffer(known.ref, known.offer, ctx());
    expect(fetchImpl.mock.calls[0]![0].pathname).toBe('/air/offers/off_direct');
    expect(result).toMatchObject({ kind: 'priced', expiresAt: '2026-09-16T11:00:00Z' });
    if (result.kind === 'priced') {
      expect(result.offer.id).toBe(known.offer.id);
      expect(result.offer.itineraryKey).toBe(known.offer.itineraryKey);
      expect(result.offer.price.customerTotal.amountMinor).toBe(26200);
    }

    const gone = setup(json(offerNoLongerAvailable, 422));
    await expect(gone.provider.priceOffer(known.ref, known.offer, ctx())).resolves.toEqual({
      kind: 'unavailable',
      reason: 'expired',
    });
    const missing = setup(json({ errors: [{ code: 'not_found' }] }, 404));
    await expect(missing.provider.priceOffer(known.ref, known.offer, ctx())).resolves.toEqual({
      kind: 'unavailable',
      reason: 'expired',
    });
    const broken = setup(json({ data: { id: 'off_direct' } }));
    await expect(broken.provider.priceOffer(known.ref, known.offer, ctx())).rejects.toMatchObject({
      code: 'FLIGHT_PROVIDER_UNAVAILABLE',
    });
  });
});
