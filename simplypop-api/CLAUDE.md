# simplypop-api

FastAPI backend for SimplyPop Creations. Single-admin site; one `app.py` handles all routes.

## Commands

```bash
# From ~/docker-projects/simplypop/
docker-compose restart fastapi
docker logs simplypop-api -f
docker logs simplypop-api --tail=50

# Database
docker exec -it postgres-server psql -U simplypop -d simplypop
```

## Key Files

| File | Purpose |
|------|---------|
| `app.py` | All routes — gallery, contact/rsvp, auth, health |
| `database.py` | psycopg2 pool. Use `get_db_connection()` context manager or pair `get_connection()` with `return_connection()` in `try/finally` |
| `image_converter.py` | Converts uploads to 3 WebP variants: `_thumb` (300px), `_medium` (800px), `_large` (2000px). Original deleted after conversion. |
| `discord.py` | Sends Discord webhook on new contact form submissions |
| `auth.py` (inline in app.py) | `get_current_user` dependency reads HttpOnly cookie; all admin routes use `Depends(get_current_user)` |

## Routes

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/gallery` | Public | Lists all gallery items |
| POST | `/gallery` | Admin | Multipart upload; triggers image conversion |
| PUT | `/gallery-edit/{id}` | Admin | Update title/event_type only |
| DELETE | `/gallery-delete/{id}` | Admin | Deletes DB row + all 3 WebP files |
| POST | `/contact` | Public | Saves to `rsvp` table; sends Discord alert |
| GET | `/contactforms` | Admin | Lists contact submissions |
| PATCH | `/contactforms/{id}` | Admin | Update status: `New`/`Pending`/`Archived`/`Follow-up` |
| DELETE | `/contactforms/{id}` | Admin | Deletes submission + any uploaded file |
| POST | `/login` | — | bcrypt check; sets HttpOnly JWT cookie |
| POST | `/logout` | — | Clears the cookie |
| GET | `/verify` | Admin | Returns current user info; used by frontend to rehydrate session |
| GET | `/health` | Public | Returns `{"status": "ok"}` |

## DB Schema

```sql
gallery (id, title, thumbnail_url, medium_url, large_url, created_at, event_type)
rsvp    (id, name, email, phone, description, budget, inspiration_file, created_at, event_date, status)
```

## Patterns to Follow

- **File uploads**: Validate extension + MIME + 10MB limit, generate safe filename with `generate_safe_filename()`, run through `image_converter.py`. Never store the original.
- **File paths in DB**: Store as `/gallery/<filename>` or `/client/<filename>` — the leading slash is intentional.
- **Cookie security**: Controlled by `ENVIRONMENT` env var. Do not hardcode `secure=True` or `samesite`.
- **New endpoints**: If you add a route, also add a `location /api/<route>` block in `../simplypop-web/nginx.conf` — the frontend nginx maps each route explicitly.
