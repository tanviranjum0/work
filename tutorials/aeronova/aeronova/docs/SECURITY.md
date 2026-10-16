# Security

This document describes controls implemented in the application and known
deployment limitations. It is not a compliance claim.

## Implemented

| Area | Control | Location |
| --- | --- | --- |
| Configuration | Zod validation rejects unsupported auth providers, unsafe production data modes, invalid MongoDB URIs, insecure production CORS origins and invalid supplier credentials. | `apps/api/src/config/env.ts` |
| Browser secrets | Only browser-safe values use `VITE_` variables. Database and supplier credentials stay in the API environment. | `apps/web/src/lib/config.ts` |
| HTTP headers | API sets restrictive content/security headers, disables `x-powered-by`, and enables HSTS in production. | `apps/api/src/middlewares/security.ts` |
| CORS | Explicit origin allowlist; credentials are disabled because API sessions use bearer tokens. | `apps/api/src/middlewares/security.ts` |
| Input | Request body size limit, strict JSON parsing, simple query parsing, and strict Zod schemas. | `apps/api/src/app.ts`, `packages/shared/src/schemas` |
| Errors and logs | Stable public errors and request IDs; logs redact authorization, cookies, tokens and sensitive personal/financial fields. | `apps/api/src/middlewares/error-handler.ts`, `apps/api/src/observability/logger.ts` |
| Passwords | Demo/test accounts use salted scrypt hashes; passwords are not logged or stored in plaintext. | `apps/api/src/auth/password.ts` |
| Sessions | Short-lived bearer tokens are kept in per-tab `sessionStorage`; there is no refresh token or cookie authentication. | `apps/web/src/features/auth/auth-context.tsx` |
| Access control | Account-owned queries are scoped to the authenticated user. Admin routes require the stored `ADMIN` role. | `apps/api/src/middlewares/authenticate.ts`, `apps/api/src/repositories` |
| Purchases | Simulated booking requires an idempotency key and is never used for real supplier offers. | `apps/api/src/services/booking/booking-service.ts` |
| Rate limiting | Per-route in-memory limits use Express's client IP. Render config trusts its one proxy hop; local config trusts none by default. | `apps/api/src/middlewares/rate-limit.ts`, `render.yaml` |
| Audit | Registration, sign-in and booking events are recorded without passwords. | `apps/api/src/services/audit` |

## Limitations

- App-managed email/password authentication is for demo and supplier-test
  modes only. `APP_MODE=production` is rejected until production-grade
  authentication, account recovery and email verification are available.
- Rate-limit counters are process-local. Multiple API instances do not share
  budgets.
- Sessions end at token expiry and require the user to sign in again.
- Bookings, payments and ticketing are simulated. No airline ticket is issued.
- MongoDB Atlas network allowlists and credential rotation must be configured
  for the selected host; never publish database credentials to the browser.

## Reporting a vulnerability

Email the maintainer rather than opening a public issue. Include reproduction
steps and the `X-Request-Id` of any failing request.
