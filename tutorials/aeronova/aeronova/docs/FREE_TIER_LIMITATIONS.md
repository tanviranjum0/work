# Free-tier limitations and deployment risk summary

## Overview

This project is designed to avoid paid infrastructure, but no platform is truly unlimited. The free-tier path still depends on provider quotas, approval, and operational discipline.

| Platform / service | Free-tier eligibility | Key limits | Operational note |
| --- | --- | --- | --- |
| Vercel | Free plan typically available for personal projects | Build minutes, bandwidth, deployment limits, function limits | Good fit for the frontend; verify current plan terms manually |
| Render | Free web service may be available subject to region and plan availability | Sleep / cold start, CPU, memory, usage caps | Must handle cold-start timeouts and not rely on always-on background jobs |
| MongoDB Atlas | Free tier may be available for small projects | Storage, RAM, connections, cluster region limits | Required for persistent production state; verify availability in the target region |
| Duffel / supplier APIs | Not free for live production flows | API quotas and approval requirements | Real flight search and booking remain blocked until credentials and permissions are valid |
| Auth providers | Some free tiers exist, but not all qualify | User limits, rate limits, MFA, domain requirements | App-managed JWT auth is simpler and avoids provider lock-in |

## Sleep, cold-start, and runtime behavior

- Render free web services may sleep after inactivity.
- Cold starts can delay first request and may time out for slow startup tasks.
- API code should avoid assuming always-on background jobs or a warm process.
- Health checks and graceful startup behavior should be explicitly verified.

## Monthly quotas and resource restrictions

- Build time, bandwidth, and function execution quota vary by provider and date.
- MongoDB Atlas free clusters are designed for small workloads; production traffic can outgrow the plan quickly.
- The app must avoid storing large files or high-volume logs in free-tier resources.

## Database storage and connection limits

- MongoDB Atlas free-tier limits depend on the current cluster type and region.
- Connection pooling and persistent socket reuse should be configured conservatively.
- Production should not rely on a free-tier database for high concurrency or large dataset growth.

## Build and deployment limits

- Source control and continuous deployment must still be configured manually in provider dashboards.
- Vercel and Render can reject builds that exceed platform limits or expect unsupported runtime settings.
- Validation should include production builds and health endpoint checks before announcing readiness.

## Third-party API limits

- Flight providers may limit requests, require approval, or prohibit commercial use without a contract.
- The app cannot issue real tickets or charge cards without valid provider integrations.
- Real search results and booking confirmations are not guaranteed under free-tier usage assumptions.

## Conditions that could cause charges

- Exceeding platform quotas or changing plans manually
- Enabling paid add-ons or premium features
- Using live supplier APIs without credits or approved accounts
- Storing more data than a free cluster permits
- Using paid email, storage, or auth features when the free plan is insufficient

## Manual verification checklist

Before claiming deployment readiness, verify the following manually in each provider dashboard:

- Current free plan is still available in the target region
- The app is connected to the correct GitHub repository
- Environment variables are configured correctly and not committed
- The database is reachable and properly indexed
- Health checks respond successfully
- Authentication is configured for the live domain and not `localhost`
- Any API quotas or limits are within the expected free-tier envelope

## Deployment risk statement

A project can be "free to start" and still not be zero-cost at runtime if provider rules change. This repo should be treated as free-tier-compatible, not guaranteed zero-cost forever.
