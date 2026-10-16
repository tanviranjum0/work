# Roadmap

## Production readiness

- Add a production-grade identity provider, email verification and account recovery before enabling `APP_MODE=production`.
- Replace the in-memory rate-limit counters with a shared store for multi-instance deployments.
- Validate MongoDB Atlas behavior and network configuration from the hosted API environment.

## Flight and booking capabilities

- Run the Duffel adapter against its test API and compare live sandbox responses with the fixture-based mapping.
- Implement real supplier orders, payment authorization and ticket issuance before presenting bookings as real.
- Add price alerts and notifications only after their persistence and delivery security are designed.

Demo bookings remain simulated and are not valid for travel.
