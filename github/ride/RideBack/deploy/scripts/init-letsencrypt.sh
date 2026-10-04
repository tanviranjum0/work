#!/usr/bin/env bash
# One-time TLS bootstrap: starts the stack and issues the first Let's Encrypt certificate.
#
#   STAGING=1 bash deploy/scripts/init-letsencrypt.sh   # dry run against LE staging first
#   bash deploy/scripts/init-letsencrypt.sh             # real certificate
#
# Renewals afterwards are automatic (certbot service + nginx 6-hourly reload).
set -euo pipefail

cd "$(dirname "$0")/../.."
ENV_FILE=.env.production
COMPOSE=(docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE")
LIVE=/etc/letsencrypt/live/api

[ -f "$ENV_FILE" ] || { echo "Missing $ENV_FILE (copy .env.production.example and fill it in)." >&2; exit 1; }

# Read single keys without sourcing the file (secrets may contain shell metacharacters).
read_env() { grep -E "^$1=" "$ENV_FILE" | tail -n1 | cut -d= -f2- | tr -d "\"'\r"; }
API_DOMAIN=$(read_env API_DOMAIN)
LETSENCRYPT_EMAIL=$(read_env LETSENCRYPT_EMAIL)
if [ -z "$API_DOMAIN" ] || [ -z "$LETSENCRYPT_EMAIL" ]; then
  echo "Set API_DOMAIN and LETSENCRYPT_EMAIL in $ENV_FILE." >&2
  exit 1
fi

if [ "${STAGING:-0}" != "1" ] && "${COMPOSE[@]}" run --rm --no-deps --entrypoint sh certbot \
    -c "test -s /etc/letsencrypt/renewal/api.conf && ! grep -q acme-staging /etc/letsencrypt/renewal/api.conf"; then
  echo "A production certificate already exists; renewals are handled by the certbot service."
  exit 0
fi

echo "==> Creating a temporary self-signed certificate so nginx can start"
"${COMPOSE[@]}" run --rm --no-deps --entrypoint sh certbot -c "
  rm -rf $LIVE /etc/letsencrypt/archive/api /etc/letsencrypt/renewal/api.conf &&
  mkdir -p $LIVE &&
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout $LIVE/privkey.pem -out $LIVE/fullchain.pem -subj /CN=localhost"

echo "==> Building and starting the stack"
"${COMPOSE[@]}" up -d --build

echo "==> Waiting for nginx to answer on :80"
for _ in $(seq 1 30); do
  # Any HTTP status (404 included) means nginx is serving; 000 means not listening yet.
  code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/.well-known/acme-challenge/probe || true)
  [ "$code" != "000" ] && break
  sleep 2
done

echo "==> Replacing the temporary certificate with a Let's Encrypt one for $API_DOMAIN"
"${COMPOSE[@]}" run --rm --no-deps --entrypoint sh certbot -c \
  "rm -rf $LIVE /etc/letsencrypt/archive/api /etc/letsencrypt/renewal/api.conf"

staging_args=()
[ "${STAGING:-0}" = "1" ] && staging_args=(--staging)
"${COMPOSE[@]}" run --rm --no-deps --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  --cert-name api -d "$API_DOMAIN" \
  --email "$LETSENCRYPT_EMAIL" --agree-tos --no-eff-email --non-interactive \
  "${staging_args[@]}"

echo "==> Reloading nginx"
"${COMPOSE[@]}" exec nginx nginx -s reload

echo "Done. Check: curl https://$API_DOMAIN/healthz"
[ "${STAGING:-0}" = "1" ] && echo "(Staging certificate: browsers will not trust it. Re-run without STAGING=1.)"
exit 0
