# Flight providers

The frontend never knows which supplier answered. Every supplier is an
adapter behind `FlightProvider` (`apps/api/src/providers/flight/flight-provider.ts`)
and returns the normalized `FlightOffer` model. Supplier identifiers stay
server-side (`ProviderOfferRef`).

| Provider | Selected by                                      | Modes                | Nearby dates | Status                                               |
| -------- | ------------------------------------------------ | -------------------- | ------------ | ---------------------------------------------------- |
| Mock     | `FLIGHT_PROVIDER=mock`                           | `demo`               | Yes          | Curated, deterministic schedule                      |
| Duffel   | `FLIGHT_PROVIDER=duffel` + `DUFFEL_ACCESS_TOKEN` | `test` | No (metered) | Search and price check. Tested against fixtures only |

## Duffel

### Setup (test mode)

1. Create a Duffel account and a **test** access token (Dashboard → Developers → Access tokens). Test tokens start with `duffel_test_`.
2. In `apps/api/.env.local`:

   ```ini
   APP_MODE=test
   FLIGHT_PROVIDER=duffel
   DUFFEL_ACCESS_TOKEN=duffel_test_...
   ```

3. `npm run dev`. Results are labelled as sandbox data. Duffel's test mode
   uses a fictional carrier ("Duffel Airways", `ZZ`) with unrealistic schedules
   and fares; use demo mode for realistic-looking demonstrations.

The API refuses to start with a live token outside production, a test token in
production, or Duffel in demo mode.

### What the adapter does

| Concern          | Implementation                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API version      | Pinned `Duffel-Version: v2` (`DUFFEL_API_VERSION`). Change it only together with a re-check of the mapping.                                                         |
| Search           | `POST /air/offer_requests?return_offers=true&supplier_timeout=…`. `supplier_timeout` is 2 s shorter than our own timeout so Duffel can return partial results.      |
| Connections      | `max_connections` 0 for nonstop, otherwise 1 (Duffel's documented default).                                                                                         |
| Price check      | `GET /air/offers/:id`. `offer_no_longer_available` (422) and 404 become "no longer available".                                                                      |
| Retries          | At most one retry, only for 502/503 or network errors on these read-only calls. Never for 429.                                                                      |
| Times            | `departing_at` / `arriving_at` are airport-local without offset; combined with each airport's `time_zone` to compute UTC.                                           |
| Price split      | Base, tax and "other supplier charges" shown only when they provably add up to `total_amount` in the same currency. Otherwise the total is shown without a split.   |
| Per passenger    | Not provided: Duffel prices the offer for all passengers together.                                                                                                  |
| Baggage          | The allowance every segment guarantees for the first passenger. Any silent segment makes it "unknown". Duffel gives piece counts, not weights.                      |
| Conditions       | `allowed: false` → not allowed; penalty `0.00` → free; penalty amount → with fee; allowed but no penalty stated → "fee not provided".                               |
| Self-transfer    | Marked as not self-transfer: the default `offers` view only returns single-ticket offers (split tickets appear only in the `itineraries` view, which we don't use). |
| Currency         | Offers in currencies outside the supported list are skipped and logged; a response is reduced to one currency.                                                      |
| Bad data         | Each offer is parsed separately with Zod; unparseable or unmappable offers are skipped and counted in a warning log.                                                |
| Errors           | 429 → `FLIGHT_PROVIDER_RATE_LIMIT`; 504/abort → `FLIGHT_PROVIDER_TIMEOUT`; everything else → `FLIGHT_PROVIDER_UNAVAILABLE`. Messages never mention the supplier.    |
| Correlation      | Our request ID is sent as `x-client-correlation-id`; Duffel's `x-request-id` is logged at debug level for support.                                                  |
| Operator display | Duffel requires the operating carrier's full name on the first screen that shows an offer; result cards show "Operated by …" for codeshares.                        |

### Known limitations

- **Not yet run against the live sandbox.** The development environment used
  so far could not reach `api.duffel.com`. The adapter is verified against
  fixtures built from the v2 documentation
  (`providers/flight/duffel/__fixtures__/offer-request.ts`, clearly marked as
  hand-built) and an end-to-end API test with a stubbed network. First thing
  to do with a real test token: run a search, save the response as a fixture,
  and compare it with the mapping above.
- **Passenger ages.** Duffel requires an age for every passenger under 18.
  The search form collects counts, so the adapter sends 7 for children and 1
  for infants (inside the standard 2–11 and under-2 bands). Booking (Phase 5)
  must collect dates of birth and reprice with real ages.
- **Nearby dates are disabled** for Duffel: each date would be a full
  supplier search.
- **Duffel orders are not implemented.** Only search and price checks use
  Duffel. `BOOKING_PROVIDER=duffel` is refused at startup (it would otherwise
  have silently booked through the simulated provider), and with Duffel
  flights booking defaults to off; explicitly enabling it is refused, because
  a simulated booking of a real supplier offer would look like an order that
  was never placed. Real booking needs Duffel orders plus real payment and
  ticketing providers.
- **Never run against the live Duffel API.** The adapter has only been tested
  against fixtures and the Duffel test environment; the live production mode
  is not enabled.
- **Offer requests are not paginated or streamed**; large result sets are
  capped by `FlightSearchService` (200 offers).

## Adding a supplier

1. Implement `FlightProvider` in `providers/flight/<name>/` with its own client, schemas and mapper.
2. Declare `capabilities` honestly (nearby dates only if searches are cheap).
3. Add the provider id to the config schema and the composition root.
4. Add mapper tests from documented or captured fixtures, an HTTP client test, and an API-level test with the network stubbed.
