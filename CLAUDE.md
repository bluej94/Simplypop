# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimplyPop Creations website (`simplypopcreations.com`) — a custom balloon/event decoration business. Two services managed together in `docker-compose.yml`:
- `simplypop-api` — FastAPI backend (port 8001 internally)
- `simplypop-frontend` — React + Vite frontend (port 80 internally)

Traffic enters via the standalone `nginx-proxy` container (separate `~/docker-projects/nginx/`, site file `nginx/sites/simplypop.conf`), not this compose stack. The Cloudflare tunnel (`simplypop-cloudflare`) was started by hand with `docker run` and is deliberately not in this repo; tunnels are set up per machine. On a fresh install the `simplypop` login and database must exist first: `~/docker-projects/postgres/create-app-db.sh simplypop`.

## Commands

```bash
# Start / rebuild
docker-compose up -d                # this machine has only the hyphenated docker-compose
docker-compose up -d --build        # After code changes

# Logs
docker logs simplypop-api -f
docker logs simplypop-frontend -f

# Database
docker exec -it postgres-server psql -U simplypop -d simplypop   # its own login, unlike the other apps

# Frontend dev server (outside Docker)
cd simplypop-web && npm run dev     # http://localhost:5173
npm run build
npm run lint

# Generate credentials
openssl rand -base64 32                                          # SECRET_KEY
python3 -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('YOUR_PASS'))"  # ADMIN_PASSWORD_HASH
```

## Backend Architecture (`simplypop-api/`)

Single-file API in `app.py`. Key patterns:

- **Auth**: Single-admin via bcrypt (`ADMIN_PASSWORD_HASH` env var). JWT stored as an **HttpOnly cookie** (not returned in body). Protected routes use `Depends(get_current_user)` which reads `Cookie(None)`.
- **DB**: psycopg2 connection pool via `database.py`. Always pair `get_connection()` / `return_connection()`, or use the `get_db_connection()` context manager. Pool initialized at startup (`init_connection_pool`), closed at shutdown.
- **Images**: Uploads are validated (extension + MIME + 10MB limit), saved with a crypto-random filename via `generate_safe_filename()`, then converted to three WebP variants by `image_converter.py`: `_thumb` (300px), `_medium` (800px), `_large` (2000px). Original is deleted after conversion.
- **File paths**: Stored as `/gallery/<filename>` or `/client/<filename>` in the DB. Served by FastAPI's `StaticFiles` mount pointing to `/app/simplypop/gallery` and `/app/simplypop/client` (bind-mounted from `~/docker-volumes/simplypop/`).
- **Cookie security**: `ENVIRONMENT=production` → `secure=True`, `samesite="strict"`. Development → `secure=False`, `samesite="lax"`.

## Frontend Architecture (`simplypop-web/`)

React 19 + Vite 7 + Tailwind CSS 4. Key patterns:

- **API calls**: `src/api/client.js` — Axios instance with `withCredentials: true` and `baseURL: /api`. This is the only correct way to make API calls; never set `Authorization` headers.
- **Auth state**: `src/store/authStore.js` (Zustand). `checkAuth()` calls `GET /verify` to rehydrate session from the HttpOnly cookie. Only call `checkAuth()` from `ProtectedRoute`, not globally in `App.jsx`.
- **Routing**: React Router 7. Admin routes at `/admin` and `/admin/login`. `ProtectedRoute` wraps `/admin` and triggers `checkAuth()` before rendering.
- **No dev proxy in vite.config.js**: API proxying is handled by the frontend container's `nginx.conf`, which routes `/api/*` → `fastapi:8001/` (strips the `/api` prefix). In local dev (`npm run dev`), set `VITE_API_BASE_URL=http://localhost:8001` to bypass nginx.

## nginx.conf (Frontend Container)

`simplypop-web/nginx.conf` is baked into the Docker image. It handles:
- SPA routing (`try_files $uri /index.html`)
- Rate limiting per endpoint zone (general 10r/s, contact 1r/m, login 5r/m, admin 20r/m)
- `/api/*` → `fastapi:8001/` proxying (each route is mapped explicitly, not with a generic strip)
- CSP and security headers

**Important**: when adding new API endpoints, add a corresponding `location /api/<route>` block here.

## Database Schema

Tables in `simplypop` database:
- `gallery` — `id, title, thumbnail_url, medium_url, large_url, created_at, event_type`
- `rsvp` — `id, name, email, phone, description, budget, inspiration_file, created_at, event_date, status`

`status` values for `rsvp`: `New`, `Pending`, `Archived`, `Follow-up`.

Migration file `migration_add_image_variants.sql` adds the three URL columns to `gallery` (already applied).

## Environment Setup

Copy `simplypop-api/.env.example` to `simplypop-api/.env`. Required vars:
- `SECRET_KEY`, `ADMIN_PASSWORD_HASH`, `DISCORD_WEBHOOK_URL`
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST` (default: `postgres-server`), `POSTGRES_PORT`
- `GALLERY_DIR=/app/simplypop/gallery`, `CLIENT_DIR=/app/simplypop/client`
- `ENVIRONMENT=production` or `development`
- `ALLOWED_ORIGINS` (comma-separated)
