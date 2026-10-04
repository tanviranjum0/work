# Deploying RideBack on a single EC2 instance

Runbook for the production stack in `docker-compose.prod.yml`: Express + Socket.IO behind nginx with Let's Encrypt TLS, MongoDB Atlas for data, and Redis either bundled on the box or on Upstash.

```
Browser ──HTTPS──► rideshare.tanvirdev.site    (Vercel: static React build)
   │
   └─HTTPS + WSS──► api.rideshare.tanvirdev.site   (EC2, Elastic IP)
                      nginx :80/:443  ── TLS, HTTP→HTTPS, ACME, WebSocket upgrade, coarse per-IP limits
                        └► api :4000  ── Express + Socket.IO (Node 24, non-root)
                             ├► redis :6379 (bundled, optional) ── BullMQ jobs, rate limits, Socket.IO adapter
                             ├► MongoDB Atlas M0 (TLS)
                             └► Google Maps, Resend (HTTPS)
```

`rideshare.tanvirdev.site` and `api.rideshare.tanvirdev.site` share the registrable domain `tanvirdev.site`, so the refresh-token cookie is same-site, which Safari (and so every iOS browser) requires. A frontend on `*.vercel.app` instead of the custom domain would make Safari treat that cookie as third-party and block it, killing sessions after 15 minutes — so once the custom domain is attached in Vercel, make sure requests actually go to `https://rideshare.tanvirdev.site`, not the `.vercel.app` URL.

**Image builds, not EC2:** GitHub Actions builds the Docker image and pushes it to GHCR; the instance only ever pulls and runs it (`.github/workflows/deploy.yml`). A t2.micro building its own image would be slow and prone to OOM/timeouts.

## Costs and free-tier limits

Verify these against your own accounts. Free-tier terms change. Your AWS account was created after 15 Jul 2025, so it's on the newer **credit-based free plan**, not the legacy 12-month one — check the exact allowance and expiry in Billing → Free Tier before relying on it.

| Item | Free allowance | Watch out for |
| --- | --- | --- |
| EC2 t2.micro / t3.micro | Credit-based free plan for new accounts (currently ~6 months) — confirm current terms in the Billing console | **t3 launches in "unlimited" CPU-credit mode.** Switch it to *standard* (Actions → Instance settings → Change credit specification), or sustained CPU is billed. |
| Public IPv4 / Elastic IP | Not included in the credit-based plan the same way as the legacy tier | About $3.60/month if billed. An unattached Elastic IP is billed too. |
| EBS | 30 GB gp2/gp3 (legacy tier figure; re-check under the credit plan) | Use a 20 GB root volume. |
| Data transfer out | 100 GB/month (legacy tier figure) | |
| MongoDB Atlas M0 | Free, 512 MB | **No backups** on M0. Throughput is capped, so don't write driver GPS pings to Mongo every second. |
| Upstash Redis | About 500K commands/month | An idle BullMQ worker polls Redis continuously and can use most of that alone. That's why bundled Redis is the default here. |
| Vercel (already deployed) | Hobby is free but **non-commercial use only** under Vercel's terms | If this becomes a paid/commercial product, move to Vercel Pro or Cloudflare Pages. |
| Domain | Already owned (`tanvirdev.site`, GoDaddy, Cloudflare DNS) | Renewal only. |
| Google Maps Platform | Free monthly calls per API | Set per-API daily quotas so abuse can't run up a bill. Still in use for geocoding/distance/autocomplete — the MapLibre/MapTiler swap is a separate later phase. |
| Resend | About 3,000 emails/month, 100/day | Sending requires a verified domain (Cloudflare DNS TXT/DKIM for `tanvirdev.site`). |

## 1. One-time setup

### AWS

1. Region: **ap-south-1** (Mumbai) — matches both your choice and the app's Asia/Kolkata timestamps.
2. Launch **Ubuntu Server 24.04 LTS**, t2.micro (or t3.micro switched to *standard* credits), with a 20 GB gp3 root volume.
3. Security group inbound rules: `22/tcp` from **your IP only**, `80/tcp` and `443/tcp` from anywhere. Don't open 4000 or 6379; those ports are reachable only inside Docker.
4. Allocate an **Elastic IP** and associate it with the instance.
5. DNS in Cloudflare: `A` record `api.rideshare.tanvirdev.site → <Elastic IP>`, set to **DNS-only (grey cloud)**. The nginx/Express IP handling assumes a single proxy hop; Cloudflare's proxy would add another.

### MongoDB Atlas

1. Create an M0 cluster in `ap-south-1` (or the nearest Atlas region to it), plus a database user with `readWrite` on the app database only.
2. Network Access: add `<Elastic IP>/32`. Don't use `0.0.0.0/0`.
3. Copy the `mongodb+srv://` string into `MONGODB_PROD_URL` and append the database name (`/rideback`). Fresh start — no existing data to migrate.

### Redis

Bundled, as agreed: keep `COMPOSE_PROFILES=local-redis` in `.env.production` and set `REDIS_PASSWORD`. Use the same password inside `REDIS_URL=redis://default:<password>@redis:6379`. Memory is capped at 64 MB with AOF persistence; costs nothing and has no command quota.

If EC2 memory gets tight later: delete the `COMPOSE_PROFILES` line and set `REDIS_URL=rediss://default:<password>@<db>.upstash.io:6379` (note `rediss://`). Watch Upstash's command quota in its console — an idle BullMQ worker alone can use most of the free monthly allowance.

### Google Maps keys

Still Google Maps for geocoding/distance/autocomplete (the backend's `map.service.js`) — the MapLibre + MapTiler/Protomaps swap is frontend map *rendering* and is scoped as a later phase, not part of this hardening pass.

- **Server key** (`GOOGLE_MAPS_API` in `.env.production`): application restriction *IP addresses* → the Elastic IP. API restriction → Geocoding, Distance Matrix, Places.
- **Browser key** (`VITE_GOOGLE_MAPS_API_KEY`): the frontend calls the Geocoding web service directly. Google doesn't allow HTTP-referrer restrictions on web-service APIs, so this key can't be locked down. Give it a tiny daily quota.
- In Google Cloud, set **per-API daily quotas** on both keys.

### Resend

Verify `tanvirdev.site` (or a subdomain) via the TXT/DKIM records Resend gives you, added in Cloudflare DNS. Then set `RESEND_API` and `RESEND_EMAIL_FROM` to an address on that verified domain.

### GitHub Actions (CI/CD)

RideBack and RideFront both live in one GitHub repo (`tanviranjum0/work`), alongside your other projects, at `github/ride/RideBack` and `github/ride/RideFront`. Only RideBack needs a workflow (Vercel deploys RideFront on its own git integration) — it lives at the repo root, `.github/workflows/rideback-deploy.yml` (GitHub never discovers workflows inside a subdirectory), and is path-filtered to `github/ride/RideBack/**` so pushes to your other projects don't trigger it.

1. On EC2, generate a deploy key pair (or reuse one) and add the **public** key to `~/.ssh/authorized_keys` for the deploy user.
2. In the `tanviranjum0/work` repo → Settings → Secrets and variables → Actions, add:
   - `EC2_HOST` — the Elastic IP or `api.rideshare.tanvirdev.site`
   - `EC2_USER` — `ubuntu`
   - `EC2_SSH_KEY` — the **private** key from step 1
   - No `GHCR_PAT` needed: the `rideback-api` package is public, so EC2 pulls it with no `docker login`. If it's ever switched back to private (package page → Settings → Change visibility), add a `GHCR_PAT` secret (classic PAT, `read:packages`) and reinstate a login step in the workflow's deploy job first.
3. (Optional) Create a `production` environment under Settings → Environments if you want a manual approval click before each deploy.

## 2. First deploy

```bash
# on the instance
git clone https://github.com/tanviranjum0/work.git ~/work
cd ~/work/github/ride/RideBack
sudo bash deploy/scripts/bootstrap-ec2.sh     # swap, Docker, unattended upgrades
exit                                          # log back in so the docker group applies

cd ~/work/github/ride/RideBack
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production                          # fill in every value, including GHCR_OWNER

git push                                      # (from your machine) triggers the first image build + push to GHCR

STAGING=1 bash deploy/scripts/init-letsencrypt.sh   # rehearsal: proves DNS + port 80 + ACME
bash deploy/scripts/init-letsencrypt.sh             # real certificate
curl https://api.rideshare.tanvirdev.site/healthz             # {"status":"ok"}
```

`init-letsencrypt.sh` pulls the image, creates a throwaway self-signed certificate so nginx can boot, starts the stack, then swaps in the real certificate and reloads nginx. Run the staging pass first: Let's Encrypt rate-limits failed production attempts. The GHCR image must exist before this runs, hence pushing first.

## 3. Operations

All commands run from the repo directory. Define an alias first:

```bash
alias dc='docker compose -f docker-compose.prod.yml --env-file .env.production'
```

| Task | Command |
| --- | --- |
| Deploy new code | `git push` to `main` — GitHub Actions builds, pushes to GHCR, SSHes in, pulls and restarts `api` automatically |
| Deploy manually / re-run | Actions tab → *Build and deploy* → **Run workflow** |
| Change nginx/compose/env on the box | these files aren't in the image: `git pull && dc up -d` after editing |
| Status / health | `dc ps` (the api shows `healthy` once Mongo and Redis are connected) |
| Logs | `dc logs -f --tail=200 api` (JSON lines; also `nginx`, `redis`) |
| Restart API | `dc restart api` |
| Roll back | edit `API_IMAGE_TAG` in `.env.production` to a previous `sha-<commit>` tag from the GHCR package page, then `dc pull api && dc up -d` |
| Check renewal | `dc run --rm --entrypoint certbot certbot renew --dry-run` |
| Clean old images | `docker image prune -f` (the disk is small) |

The API is a single process. A deploy causes a few seconds of downtime while the new container starts, and Socket.IO clients reconnect automatically.

**Monitoring:** point a free uptime checker (UptimeRobot, Better Stack) at `https://api.rideshare.tanvirdev.site/healthz`. It returns 503 when Mongo or Redis is disconnected.

**Backups:** Atlas M0 has none. Run a nightly `mongodump --uri "$MONGODB_PROD_URL" --gzip --archive` from a machine with the MongoDB database tools, and copy it off the instance.

## 4. Frontend hosting (Vercel)

Already deployed on Vercel with Cloudflare DNS. Set these as **Production** environment variables in the Vercel project dashboard (Settings → Environment Variables) — not in a committed file, since `VITE_*` values are compiled into the public bundle but still shouldn't live in git:

```
VITE_SERVER_URL=https://api.rideshare.tanvirdev.site
VITE_ENVIRONMENT=production
```

See `RideFront/.env.production.example` for the full list, including the Maps browser key.

Rewrites and headers come from `RideFront/vercel.json`, already committed. It ships a `Content-Security-Policy-Report-Only` header for `api.rideshare.tanvirdev.site` — watch the browser console on the live `rideshare.tanvirdev.site` site for violations for a few days, then flip it to `Content-Security-Policy` (same file).

Confirm in Vercel → Domains that `rideshare.tanvirdev.site` is attached and set as the primary domain (not just the `.vercel.app` one), and in Cloudflare DNS that its record is **proxied (orange cloud)** per Vercel's own instructions, or DNS-only with the exact target Vercel gives you — these two settings commonly conflict, so follow whichever Vercel's domain page currently asks for.

Backend `FRONTEND_ORIGINS` must list the exact frontend origin (`https://rideshare.tanvirdev.site`), or CORS, the CSRF origin check and Socket.IO will all reject the browser.

## Troubleshooting

- **nginx exits on first start:** the certificate files are missing. Run `init-letsencrypt.sh` rather than `dc up`.
- **ACME challenge fails:** check that DNS resolves to the Elastic IP (`dig +short api.rideshare.tanvirdev.site`), port 80 is open, and the Cloudflare record for `api` is DNS-only (grey cloud), not proxied.
- **`docker compose pull` fails with "unauthorized"**: either `GHCR_OWNER` in `.env.production` is wrong, or the package is private and nothing has run `docker login ghcr.io` on the box yet — the deploy workflow does this each run, but a manual `dc pull` won't until you've logged in once by hand, or made the package public.
- **Every request gets 429:** `TRUST_PROXY` must be `1` (pinned in compose), so the app sees real client IPs rather than nginx's.
- **API unhealthy, logs show `MongoServerSelectionError`:** the Atlas IP allowlist is missing the Elastic IP.
- **The build is killed (exit 137) during image build:** that's GitHub's runner, not EC2 — unlikely, but check the Actions log; EC2 itself never builds the image.
