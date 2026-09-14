# Route optimizer — integration notes (v6)

Type-checked with `tsc --strict --noUnusedLocals --noUnusedParameters` against
real `mongoose`/`express` type packages before delivery — no compiler errors.

## What changed in v6 — mixed routes are now a separate, simpler algorithm

`mixedRoute.optimizer.ts` was rewritten from scratch, and `route.handler.ts`
got one small addition. `routeType="number"` is completely untouched —
`numberedRoute.optimizer.ts` and `core.optimizer.ts` still work exactly as
before, still handle warehouse refill/unload, still include every required
shipment.

Mixed routes now follow a genuinely different, deliberately simple
algorithm:

- **No warehouse stops, ever.** A candidate that would need a refill or
  unload to fit isn't deferred or worked around — it's just left out.
- **Capped at 3 shipments.** Candidates are ranked highest-priority-first
  (urgent pulled to the front, then a nearest-neighbor walk outward from
  the depot, staleness as a tiebreaker), and the walk keeps at most 3.
- **Single pass, no backtracking.** Each candidate is tried once, in rank
  order. A candidate is kept only if the route stays capacity-feasible for
  _some_ initial load between 0 and `vehicleCapacity` with it included —
  checked via the same running-trough/peak math used for exact refill
  sizing on the numbered-route side, just with no refill available to fall
  back on. If it doesn't fit, it's skipped and the walk moves to the next
  candidate — never abandoned early, never revisited.
- **Route status.** `route.handler.ts` now stamps mixed routes with
  `MIXED_ROUTE_STATUS = "ready-for-delivery"` instead of the numbered
  routes' `"scheduled"` — adjust that literal string to match your actual
  status enum.

Distance still gets the same 2-opt/relocate polish pass as before (safe
here too, for the same reason it's safe elsewhere: reordering a fixed set
of shipments never changes the entry/exit load, only whether the
_specific_ new order stays feasible, which is checked before accepting
it) — "single pass" refers to the _selection_ not backtracking, not to
skipping the cheap distance cleanup afterward.

Verified two ways: a run against 12 real candidate shipments (capped at
exactly 3, all within 2.14 km of each other), and a tight-capacity case
where a genuinely-too-big shipment gets skipped while a same-priority
smaller one still gets in.

`core.optimizer.ts`'s `mode: "mixed"` branch is now unreachable — nothing
calls it anymore — but it's left in place rather than removed, since
`routeType="number"` was explicitly called out as working and not to be
risked. Worth pruning later if you're sure you won't want the old
warehouse-aware mixed-route behavior back.

## What changed in v5 — no shipment for the initial load

Only `route.handler.ts` changed. The route's `shipments` array no longer
starts with a synthetic "Warehouse — Load" entry for the initial load —
that's redundant with `result.initialLoad`, which was already being saved
as a plain number on the Route document. The persisted array now starts
directly with the first real shipment stop.

Mid-route depot visits (refill/unload) are unaffected — those still get
materialized as real Shipment documents, since they're actual stops the
driver visits and aren't captured anywhere else. Only the very first,
`reason: "initial-load"` stop is now skipped, via a `routeStops` filter
applied before both the materialization step and the final assembly —
`core.optimizer.ts` and everything upstream of the handler is untouched,
since the optimizer still needs that stop internally (route validation,
segment boundaries for the local-search pass) — this is purely a
handler-level decision about what gets persisted.

Verified by replaying a real optimizer result through the handler's exact
filtering logic: the persisted stop list now starts with the first
customer shipment, and no stop with `reason: "initial-load"` appears in
it.

## What changed in v4 — refill sizing was over-counting

Only `depot.service.ts` changed this round, fixing a real bug in the v3
batching logic: `maybeBuildRefillCandidate` projected total future demand
correctly, but then used that _total_ directly as the refill quantity
instead of subtracting the load already on the truck. Concretely: 25 boxes
on board, two deliveries ahead needing 115 + 120 = 235 → it refilled by
235 (capped to 215 by headroom) instead of the correct 235 − 25 = 210.

Fixed by projecting the vehicle's actual load (starting from what's
really on board, not from zero) through the upcoming stops and finding
the lowest point it would hit — the shortfall there is exactly the right
amount, mirroring the pattern `maybeBuildUnloadCandidate` already used
correctly (track absolute load, compare against capacity at the peak).

Verified two ways:

- A direct unit test of your exact reported numbers (25 on board, 115 +
  120 ahead): refill quantity is now **210**, not 215, and the truck lands
  at exactly 0 after both deliveries.
- Re-ran the "4→3 visits" example from the last round: it hit the same
  bug at its second refill point (75 instead of the correct 10), leaving
  65 unused boxes on the truck at the end of the route. Same fix, same
  route/distance, but it now finishes at exactly 0.

## What changed from v1

The warehouse is no longer a single reused Shipment record. The handler now
creates a **real, separate Shipment document for every depot visit** in the
finished route — each with `shipmentType` derived dynamically from the
direction of the load change (a load — initial load or refill — is a
`"collection"`, since it increases vehicle load the same way a customer
collection does; an unload is a `"delivery"`, since it decreases it), and
`boxQuantity` set to the exact amount moved at that stop. These get spliced
into `Route.shipments` in exact route order, alongside the real customer
shipment documents — matching what you'd already fixed by hand.

`core.optimizer.ts`, `depot.service.ts`, `capacity.service.ts`,
`scoring.service.ts`, `candidate.service.ts`, `improvement.service.ts`,
`distance.service.ts`, `mixedRoute.optimizer.ts`, `numberedRoute.optimizer.ts`,
and `types.ts` needed **no changes** — they only ever needed _a_
`ShipmentDocument`-shaped object to represent the depot during construction,
not specifically a persisted one. So the optimizer now gets a throwaway,
never-saved template (`buildWarehouseTemplate`); the real per-visit records
are created afterward, once the route is finalized. Only these four files
changed:

- **`warehouse.service.ts`** — rewritten. `ensureWarehouseShipment` is gone;
  replaced by `buildWarehouseTemplate` (in-memory only, no DB call) and
  `createWarehouseVisitShipments` (persists one real doc per depot stop via
  a single `insertMany`).
- **`validation.service.ts`** — `validateWarehouseShipment` renamed to
  `validateWarehouseVisitShipment` and relaxed: `shipmentType` now
  legitimately accepts either `"collection"` or `"delivery"`, and
  `boxQuantity` accepts `0` (a depot arrival that neither loads nor unloads
  anything is valid).
- **`routeOptimizer.service.ts`** — re-exports updated to match.
- **`route.handler.ts`** — rewritten and **relocated** into
  `services/routeOptimizer/` (matching where you'd already moved it), pulls
  `userId` from `req.userId` (your auth middleware) rather than trusting the
  request body, and assembles `Route.shipments` by walking `result.stops` in
  order and mapping each one to either its customer shipment document or its
  freshly created warehouse-visit document — so every stop, depot included,
  ends up correctly represented.

## 1. Schema change (required) — replaces the v1 index

Still need `isWarehouse` on the Shipment schema:

```ts
isWarehouse: { type: Boolean, default: false },
```

**Do not add the partial-unique index from v1.** With per-visit shipments,
several documents can now legitimately share the same
`OwnerRef`/`routeNumber`/`deliveryShift`/`isWarehouse: true` combination —
one per depot visit — so that index would throw duplicate-key errors on the
second warehouse stop of any route. Use a plain (non-unique) index instead,
just for the candidate-query exclusion filter:

```ts
shipmentSchema.index({
  OwnerRef: 1,
  routeNumber: 1,
  deliveryShift: 1,
  isWarehouse: 1,
});
shipmentSchema.index({ OwnerRef: 1, deliveryShift: 1, status: 1 });
```

If you already added the v1 partial-unique index, drop it.

## 2. Environment variables

```
DEPOT_LAT=52.4002
DEPOT_LNG=4.6417
```

Both default to those values if unset (see `depot.service.ts`).

## 3. Wiring the route

```ts
import { createOptimizedRoute } from "./services/routeOptimizer/route.handler.js";
router.post("/routes/optimize", authMiddleware, createOptimizedRoute);
```

`createOptimizedRoute` expects `req.userId` to already be set by your auth
middleware (it returns 401 if it isn't) — it no longer trusts a `userId` in
the request body.

## 4. Assumptions worth checking against your actual schemas

- **`Route.shipments`** is now populated with the actual shipment documents
  (plain objects with `_id`), in exact route order — not bare `ObjectId`
  refs. This works whether your schema field is `[{ type: ObjectId, ref:
'Shipment' }]` (Mongoose reads `_id` off each object) or an embedded
  subdocument array — but if it's something else, adjust the
  `orderedShipments` assembly in `route.handler.ts` accordingly.
- **Warehouse-visit shipment fields** (`clientPhoneNumber`, `pickupAddress`,
  etc. in `buildWarehouseVisitPayload`) are placeholders matching the shape
  of your original example — check they satisfy any `required`/format
  validators on your actual Shipment schema.
- **`totalBoxes`** on the saved Route is still the sum of `boxQuantity`
  across customer shipments only (not warehouse visits, not shipments left
  unassigned on a mixed route).
- **No transaction.** If `Route.create` fails after the warehouse-visit
  shipments were already persisted, the handler deletes them again
  (compensating cleanup) rather than leaving orphaned records. A Mongo
  session/transaction would be more robust if you're running a replica set
  — this is the standalone-safe fallback.
- **`generateRouteNumber`** produces something like `MX-a1b2c3-LP3K9F2Q`.
  Swap in your own scheme if you already have a route-numbering convention
  elsewhere in the app.

## 5. A structural note (unchanged from v1)

The spec's file list puts the full construction loop inside
`mixedRoute.optimizer.ts` and `numberedRoute.optimizer.ts` separately. I
pulled the shared loop out into `core.optimizer.ts` instead, since it's
identical between the two modes (only the candidate pool and the
termination rule differ) — duplicating it would've meant keeping two
~150-line loops in sync by hand. `mixedRoute.optimizer.ts` and
`numberedRoute.optimizer.ts` are thin wrappers that just set `mode`.

## 6. On the capacity-check pattern (unchanged from v1)

Every place a warehouse operation size is computed
(`maybeBuildRefillCandidate` / `maybeBuildUnloadCandidate` in
`depot.service.ts`) anchors on _remaining_ capacity (`vehicleCapacity -
currentLoad`), not full `vehicleCapacity` — so this shouldn't reproduce the
capping bug from the Distance-Matrix version of `efficientRoute.service.ts`.
