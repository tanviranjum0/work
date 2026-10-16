# API

Base path `/api/v1`. Every response uses the same envelope:

```json
{ "success": true, "data": {} }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "…", "requestId": "…", "issues": [{ "path": "journeys.0.origin", "message": "…" }] } }
```

`message` is written for travellers. `code` is stable (see
`packages/shared/src/errors/error-codes.ts`). Every response carries
`X-Request-Id`; callers may send a well-formed one to correlate logs.

Only endpoints that exist are listed. An OpenAPI document is generated in Phase 9.

## Health

| Method | Path            | Notes                                                                |
| ------ | --------------- | -------------------------------------------------------------------- |
| GET    | `/health`       | `{ status, mode, version }`. Never exposes configuration.            |
| GET    | `/health/live`  | Liveness. Not access-logged.                                         |
| GET    | `/health/ready` | Runs cheap dependency checks with a 2 s cap each. `503` if any fail. |

## Airports

| Method | Path                         | Limits             | Notes                                                           |
| ------ | ---------------------------- | ------------------ | --------------------------------------------------------------- |
| GET    | `/airports/search?q=&limit=` | 120/min per client | `q` 2–64 chars, `limit` 1–20 (default 8). Cacheable for 1 hour. |
| GET    | `/airports/:code`            | —                  | `{ airport, nearby[] }` within 120 km. `404` for unknown codes. |

Suggestions are `LocationSuggestion` objects. A `city` row (`LON`) stands for
all its airports.

## Flight search

| Method | Path                | Limits            | Notes                                                      |
| ------ | ------------------- | ----------------- | ---------------------------------------------------------- |
| POST   | `/search/flights`   | 20/min per client | Body: `FlightSearchInput`. Returns `FlightSearchResponse`. |
| GET    | `/search/:searchId` | —                 | Reopens a stored search for 60 minutes, then `404`.        |
| POST   | `/search/flexible`  | 6/min per client  | Same body as a search. Returns `FlexibleDatesResponse`.    |

Request:

```json
{
  "tripType": "round_trip",
  "journeys": [
    { "origin": "DAC", "destination": "LHR", "departureDate": "2026-12-20" },
    { "origin": "LHR", "destination": "DAC", "departureDate": "2027-01-05" }
  ],
  "passengers": { "adults": 1, "children": 0, "infants": 0 },
  "cabin": "economy",
  "currency": "USD",
  "directOnly": false
}
```

Rules (shared schema, `packages/shared/src/schemas/flight-search.ts`):
dates are real calendar dates, not before today at the first departure
airport and at most 361 days ahead; journeys are chronological; a round trip
returns along the same route; 1–9 travellers with at least one adult and no
more infants than adults; unknown airports return `INVALID_AIRPORT`.

Response highlights: `dataOrigin` (`demo` / `sandbox` / `live`),
`conversion` (`none` / `demo_rates`, which must be disclosed), `expiresAt`,
`truncated`, and `offers[]` as `RankedOffer` (offer, metrics, score,
badges, comparison). No supplier identifiers are included.

Errors: `VALIDATION_ERROR` 400, `INVALID_AIRPORT` 400, `RATE_LIMITED` 429,
`FLIGHT_PROVIDER_TIMEOUT` 502, `FLIGHT_PROVIDER_UNAVAILABLE` 502. An empty
result is `200` with `offers: []`.

### Nearby dates

`POST /search/flexible` returns the lowest total for the same trip moved
−3…+3 days (all journeys move together). Each cell has `offsetDays`,
`departureDates[]`, `status` (`ok`, `no_flights`, `out_of_range`,
`unavailable`) and `lowestTotal`. When the connected supplier is metered the
response is `{ "supported": false, "cells": [], "dataOrigin": null }` and
clients hide the view. One failing date never fails the request.

### Place names

Every `FlightSearchResponse` includes `places`, keyed by airport or city code,
with `cityName`, `airportName` (null for multi-airport cities), `countryName`
and `timeZone`, covering the query and every airport in the offers.

## Offer pricing

| Method | Path            | Limits            | Notes                                                 |
| ------ | --------------- | ----------------- | ----------------------------------------------------- |
| POST   | `/offers/price` | 30/min per client | Body: `{ searchId, offerId }`. Returns `PricedQuote`. |

Search prices are indicative. This call re-confirms one offer with the
supplier and returns a quote:

- `status`: `confirmed` (same total) or `changed` (the client must show old
  and new totals and get the traveller's acceptance before continuing)
- `offer`: the offer as priced now, in the search currency
- `previousTotal`: the total from the search results
- `quoteId`, `expiresAt`: the booking step (Phase 5) will require an
  unexpired quote

Errors: `OFFER_EXPIRED` 410 (offer or its search is gone: search again),
`NOT_FOUND` 404 (offer not part of that search), `VALIDATION_ERROR` 400,
`FLIGHT_PROVIDER_TIMEOUT` / `FLIGHT_PROVIDER_UNAVAILABLE` 502. Pricing is
never retried automatically.

In demo mode the mock supplier is deterministic: an offer past its 30-minute
lifetime is expired, about one in four offers comes back 3% higher, and the
rest are confirmed unchanged.

## Accounts

All account endpoints need `Authorization: Bearer <token>` and are scoped to the
signed-in user: an id belonging to someone else returns `404`, never their data.

| Method | Path                  | Limits      | Notes                                                             |
| ------ | --------------------- | ----------- | ----------------------------------------------------------------- |
| POST   | `/auth/register`      | 10 / 15 min | Demo email/password auth. Returns a token and the profile.        |
| POST   | `/auth/login`         | 10 / 15 min | Demo email/password auth. Same error whatever is wrong.           |
| GET    | `/users/me`           | 60/min      | `UserProfile`.                                                    |
| PATCH  | `/users/me`           | 60/min      | `displayName` and/or `preferences`; unset keys stay as they were. |
| GET    | `/travelers`          | 60/min      | Saved travellers, max 20 per account.                             |
| POST   | `/travelers`          | 60/min      | `201`. No identity-document numbers are accepted or stored.       |
| PATCH  | `/travelers/:id`      | 60/min      | Full replacement of the traveller's details.                      |
| DELETE | `/travelers/:id`      | 60/min      | `204`.                                                            |
| GET    | `/saved-searches`     | 60/min      | Newest first, max 20 per account.                                 |
| POST   | `/saved-searches`     | 60/min      | `{ label, params }` where `params` are search URL parameters.     |
| DELETE | `/saved-searches/:id` | 60/min      | `204`.                                                            |

The `/auth/*` endpoints use the app-managed demo provider. Roles come from
storage, never from the request body or token claims a client controls.
`APP_MODE=production` is currently rejected until production-grade
authentication is available.

## Bookings

All booking endpoints need a bearer token and are scoped to the signed-in user.

| Method | Path                                 | Limits | Notes                                                                                                                                                                                        |
| ------ | ------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/bookings`                          | 10/min | Requires an `Idempotency-Key` header (16–128 safe characters).                                                                                                                               |
| GET    | `/bookings`                          | 10/min | Trips, newest first. Attempts that failed before reserving are omitted.                                                                                                                      |
| GET    | `/bookings/:reference`               | 10/min | `404` for someone else's reference.                                                                                                                                                          |
| POST   | `/bookings/:reference/cancel`        | 10/min | `409` when the state no longer allows it.                                                                                                                                                    |
| GET    | `/bookings/:reference/itinerary.pdf` | 10/min | Downloadable PDF built from the booking's snapshot; `application/pdf`, not the JSON envelope. Omits passport numbers, date of birth and contact details. `404` for someone else's reference. |

The body carries `quoteId` (from `/offers/price`), `passengers`, `contact`,
a simulated `payment` and `acceptedTerms`. Real card details are never sent to
this API; a real provider would receive a token created in the browser.

**Idempotency.** The same key with the same body returns the first booking.
The same key with a different body is `IDEMPOTENCY_CONFLICT` (409). A key whose
attempt failed can be retried.

**States.** `DRAFT → PAYMENT_PENDING → PAYMENT_AUTHORIZED → BOOKING_CONFIRMED →
TICKETING_PENDING → TICKETED`. Anything that fails _after_ payment becomes
`PAYMENT_RECONCILIATION_REQUIRED` (502 to the caller, booking kept and flagged),
never a silent failure. Cancellation moves through `CANCEL_REQUESTED` to
`REFUND_PENDING` or `CANCELLED`.

**Simulated.** Every booking carries `simulated: true` while mock providers are
in use, tickets are numbered `DEMO-…` and carry `simulated: true`. These are not
airline documents and are not valid for travel.

## Admin

Every endpoint needs a bearer token belonging to a user with the `ADMIN` role
(`requireAuth` then `requireRole('ADMIN')`) and shares one rate-limit bucket,
separate from every other group.

| Method | Path                         | Limits | Notes                                                                                                                                                          |
| ------ | ---------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/admin/metrics`             | 30/min | Total users, bookings by state, and booking totals **per currency** — never summed across currencies into one figure.                                          |
| GET    | `/admin/users`               | 30/min | Every account, newest first (`?limit=`, capped at 200). Never includes a password hash.                                                                        |
| GET    | `/admin/bookings`            | 30/min | Every user's bookings, newest first (`?limit=`, `?state=`).                                                                                                    |
| GET    | `/admin/bookings/:reference` | 30/min | Any user's booking by reference — not scoped to the caller. `404` for an unknown reference.                                                                    |
| GET    | `/admin/audit-log`           | 30/min | Newest first (`?limit=`, `?type=` — one of the `AuditEventType` values below).                                                                                 |
| GET    | `/admin/provider-status`     | 30/min | App mode and which provider is configured for flights/booking/payment/ticketing/auth. Never includes anything from `config.secrets` — not even a masked token. |
| GET    | `/admin/whoami`              | 30/min | `{ id, roles }` for the caller. Used by the web app's own admin guard.                                                                                         |

**Becoming an admin.** Only the dev auth provider supports this, and only
locally/in demo mode: set `DEMO_ADMIN_EMAIL` and register that exact email —
it gets `ADMIN` on that one registration, not retroactively. Forbidden in
production by config validation. There is no way to promote an existing
account; production admin provisioning is not yet implemented.

**Audit events.** `USER_REGISTERED`, `LOGIN_SUCCEEDED`, `LOGIN_FAILED`
(includes the attempted email, never the password), `BOOKING_CREATED`,
`BOOKING_CANCELLED`. Recording an event can never fail the request it
describes — a broken audit store logs an error instead of throwing.
