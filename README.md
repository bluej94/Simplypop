# Simplypop
Website for SimplyPop Creations, a balloon and event decoration business
([simplypopcreations.com](https://simplypopcreations.com)): portfolio gallery,
contact form and a small admin area.

- `simplypop-api/` — FastAPI backend (container `simplypop-api`, port 8001 on the Docker network)
- `simplypop-web/` — React site served by nginx (container `simplypop-frontend`)

`CLAUDE.md` is the detailed reference for how everything works.

## Running it on a machine

Needs Docker, the standalone `docker-compose`, and the shared PostgreSQL and
`nginx-proxy` containers from the [Server](https://github.com/bluej94/Server) repo,
whose `install.sh` clones and starts this app.

```bash
git clone git@github.com:bluej94/Simplypop.git ~/docker-projects/simplypop
cd ~/docker-projects/simplypop

# Secrets are never in git. Copy the real files from the old server, or start
# from the templates and fill them in:
cp simplypop-api/.env.example simplypop-api/.env
cp simplypop-web/.env.example simplypop-web/.env

# Fresh install only: SimplyPop uses its own database login. The Server repo's
# install.sh creates it for you; restore.sh brings it along when moving.
# By hand:
~/docker-projects/postgres/create-app-db.sh simplypop

docker-compose up -d --build
```

Uploaded photos live in `~/docker-volumes/simplypop/` (gallery and client
uploads), never in git.

## Cloudflare tunnel (optional, per machine)

Not in this repo. On the old server it runs as a container started by hand
(`simplypop-cloudflare`). On a server that uses a tunnel, either run it the same
way or add an untracked `docker-compose.override.yml` with a `cloudflared`
service, as the other app repos describe. Never run the same tunnel on two
machines at once.
