# RideBack backend

## Runtime configuration

Set these variables in the deployment secret/configuration manager; do not commit credentials:

| Variable | Required | Purpose |
| --- | --- | --- |
| `ENVIRONMENT` | Yes | `development` or `production` |
| `JWT_SECRET` | Yes | HS256 access-token signing key; at least 32 characters in production |
| `OTP_HASH_SECRET` | Production | Separate HMAC key for hashing ride OTPs; at least 32 characters |
| `MONGODB_PROD_URL` / `MONGODB_DEV_URL` | Yes | MongoDB connection string selected by `ENVIRONMENT` |
| `REDIS_URL` | Production | Shared rate-limit store, background jobs, and Socket.IO adapter |
| `FRONTEND_ORIGINS` | Production | Comma-separated exact browser origins allowed by CORS and CSRF checks |
| `CLIENT_URL` | Email flows | Client base URL used to build verification and password-reset links |
| `GOOGLE_MAPS_API` | Map/ride flows | Google Maps API key |
| `RESEND_API`, `RESEND_EMAIL_FROM` | Email flows | Resend API key and verified sender |
| `TRUST_PROXY` | If proxied | Integer number of trusted reverse-proxy hops; set only for trusted infrastructure |
| `PORT` | No | HTTP listen port (default `4000`) |
| `BACKGROUND_JOB_CONCURRENCY` | No | Background worker concurrency (default `10`) |

Production startup fails when required JWT, MongoDB, Redis, browser-origin, Maps, or Resend configuration is missing. `CLIENT_URL` must be one of the allowlisted frontend origins. Use TLS for HTTP, MongoDB, and Redis connections. Redis stores queued email bodies and must be protected with network controls, authentication, and encryption in transit.

## Authentication and API changes

- Access tokens use HS256 and expire after 15 minutes. They are returned as `token` for API clients and set in an `httpOnly` cookie for browser clients.
- A rotating opaque refresh token is stored only in an `httpOnly`, `Secure` production cookie for 30 days. Refresh with `POST /auth/refresh`; send browser credentials and an allowlisted `Origin`. Production cookies use `SameSite=None` for cross-origin web clients, with Origin validation as the CSRF control.
- API clients should send access tokens as `Authorization: Bearer <token>`. The legacy `token` request header is no longer accepted.
- Logout is `POST /user/logout` or `POST /captain/logout`. Ride cancellation is `POST /ride/cancel` with `{ "rideId": "..." }`; ride start is `POST /ride/start-ride` with `{ "rideId": "...", "otp": "..." }`.
- Cookie-authenticated unsafe requests require an allowlisted `Origin`. Browser clients must use credentialed requests and the configured `FRONTEND_ORIGINS`.
- Rider and driver routes enforce separate JWT roles. This repository has no administrator identity/provisioning model; admin authorization must not be enabled by issuing ad-hoc role claims.

Input schemas reject invalid route data and MongoDB operator-style keys. JSON payloads are limited to 16 KB. JSON responses do not make arbitrary user text safe for HTML rendering; clients must apply context-appropriate output encoding.

## Runtime operations

Production rate limits use Redis and cover general API traffic, authentication, verification/email, maps, and ride creation. Email delivery and ride dispatch use retryable BullMQ jobs when Redis is configured; in development without Redis, email is sent directly and ride dispatch runs asynchronously in-process.

Captain location and ride-history indexes are declared in the Mongoose schemas. Confirm those indexes exist in MongoDB after deployment; production index builds should be planned against the collection size and deployment topology. Socket.IO requires the shared Redis adapter for cross-instance rooms and socket-ID delivery.

New ride OTPs are stored as HMAC-SHA-256 hashes and are returned only to the rider creating the ride. Existing rides with legacy plaintext OTPs remain readable for compatibility and should be drained or migrated before removing the legacy field.

Run focused checks with:

```sh
npm test
npm audit --omit=dev
```
