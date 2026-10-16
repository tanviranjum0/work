# Single-service Render deployment

Render deploys AeroNova as one Node web service from the repository root. The build compiles the Express API and the Vite frontend; Express serves the frontend assets, SPA routes, API, and health endpoints on the same HTTPS origin. No separate Vercel project or CORS origin is needed.

This is a production-hosted **demo-mode application**, not a live travel agency. `NODE_ENV=production` enables production HTTP behavior, while `APP_MODE=demo` keeps mock flights and developer authentication. `APP_MODE=production` is intentionally rejected until production identity is implemented. Booking, payment, and ticketing are simulated, and booking records remain in memory.

## Deploy

1. Push the repository to a Git provider supported by Render.
2. Create a Render Blueprint from the repository and apply the root [`render.yaml`](../render.yaml).
3. Use a paid Render instance for production availability. The Blueprint uses the `starter` plan; Render Free instances sleep when idle and are not intended for production.
4. When prompted, provide `MONGODB_URI` if account and search data must persist across restarts. Without it, the demo still starts, but account and search data use process memory.
5. Wait for the build and deployment to finish, then open the service URL.

The Blueprint sets the repository root as `rootDir`, runs `npm ci && npm run build`, starts the API workspace, and checks `/health`. Render injects `PORT`. The frontend and API share an origin, so leave `CORS_ORIGINS` unset.

## Verify

- Open the service URL and refresh a nested client-side route; it should return the AeroNova app.
- Open `/health` and `/health/ready` on the same host.
- Register a demo account and run a sample flight search.
- If MongoDB is configured, `/health/ready` should report the database as `ok`.

## Current feature limits

- Flight search defaults to curated mock schedules. Duffel test search can be enabled with a valid `duffel_test_` token and `APP_MODE=test`; that is a supplier sandbox, not live service.
- Booking, payment, and ticketing providers are mocks. They do not charge a card, place an airline order, or issue a ticket.
- Booking records and idempotency state are in memory. Do not rely on persistent booking history or horizontal scaling for bookings.
- Demo authentication is not a production identity and account-recovery system.
- MongoDB persists repository-backed account and search data when configured; it does not make in-memory bookings persistent.

Enable real commercial operations only after production identity, durable booking and idempotency storage, real payment and ticketing integrations, supplier contracts, webhook handling, refunds, monitoring, backups, and operational support are implemented and reviewed.

## Rollback

Use Render's previous successful deployment to roll back the service. After rollback, check `/health`, `/health/ready`, and the primary search flow.

## References

- [Render Blueprints](https://render.com/docs/blueprint-spec)
- [Render health checks](https://render.com/docs/health-checks)
- [Render Node.js version selection](https://render.com/docs/node-version)
