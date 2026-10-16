# Free deployment migration plan

## Scope and baseline

This repository is already structured as a monorepo with a React/Vite frontend and an Express API. The normal local development path is working with demo data. The AWS-specific deployment assets (CDK stacks, Lambda packaging, Cognito
configuration, CloudFront setup and AWS CLI deployment scripts) have been
removed. They are not required for local development or the free-tier path.

## Repository findings

- Frontend entry point: `apps/web` via Vite (`npm run dev`, `npm run build`)
- API entry point: `apps/api` via Express (`src/server.ts`, `src/app.ts`)
- Hosted deployment: Vercel frontend, Render API and optional MongoDB Atlas persistence
- Runtime authentication: app-managed email/password sign-in for demo/test modes
- Current default app mode in examples: demo mode, which works without AWS or external accounts.
- Real supplier and payment flows remain gated behind provider credentials and are not production-ready under zero-cost constraints.

## Migration table

| Existing component | Current dependency | Replacement | Free-tier suitability | Required environment variables | Risks and limitations |
| --- | --- | --- | --- | --- | --- |
| Frontend app | AWS S3 + CloudFront | Vercel static app | Strong fit | `VITE_API_BASE_URL` | Need production domain config; must not expose secrets |
| API service | AWS Lambda + API Gateway | Render Web Service | Strong fit | `PORT`, `APP_MODE`, `MONGODB_URI`, `DUFFEL_ACCESS_TOKEN` | Free services may sleep; must handle cold starts and timeouts |
| MongoDB persistence | Optional AWS Secrets Manager + Dynamo-like patterns in docs | MongoDB Atlas Free tier | Eligible if region and usage limits allow | `MONGODB_URI` | Shared-cluster limits, connection caps, storage quotas |
| Auth | Cognito hosted UI | App-managed email/password for demo/test | Demo only | `AUTH_PROVIDER=dev`, `DEV_AUTH_SECRET` | Production mode remains disabled until production-grade identity and account recovery are implemented |
| Deployment automation | AWS CDK + CLI | GitHub + Vercel + Render dashboards | Good fit | Platform dashboard vars | Manual checks still required; no automated AWS launch |
| Static assets | S3/CloudFront | Vercel asset hosting | Good fit | N/A | Must keep API keys out of frontend bundles |
| Logging | CloudWatch | Render/Vercel logs plus app logger | Good fit | `LOG_LEVEL` | Log retention and observability are limited by free tiers |
| Deployment docs | AWS guide | Vercel/Render guide + migration documents | Good fit | N/A | Requires manual verification before production use |

## Active deployment path

The active deployment path is now:

- Frontend -> Vercel
- API -> Render Web Service
- Data -> MongoDB Atlas free cluster
- Auth -> app-managed password sign-in for demo/test modes

AWS infrastructure and Lambda support have been removed from the repository.

## Required verification before deployment

1. Confirm `npm ci` succeeds.
2. Confirm local demo mode runs: `npm run dev`.
3. Confirm API health endpoints work.
4. Confirm production builds succeed: `npm run build`.
5. Confirm environment variables are server-side only.
6. Confirm Vercel and Render use HTTPS domains and no `localhost` in production.
7. Confirm `MONGODB_URI` is never leaked to the browser.
8. Confirm provider credentials are external-only and never committed.

## Known blockers

- Real flight supplier, booking, payment, and ticketing flows are not production-ready without external provider credentials and approvals.
- A zero-dollar deployment path still requires manual account setup, provider approvals, and monitoring of free-tier limits.
- If an identity provider or supplier requires a commercial contract, document the blocker instead of pretending the feature is live.
