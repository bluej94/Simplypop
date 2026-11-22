# simplypop-web

React 19 + Vite 7 + Tailwind CSS 4 frontend for SimplyPop Creations.

## Commands

```bash
npm run dev      # Dev server at http://localhost:5173
npm run build    # Production build
npm run lint     # ESLint
```

> **Local dev**: API proxying is done by nginx in production. For `npm run dev`, set `VITE_API_BASE_URL=http://localhost:8001` in a `.env.local` file.

## Key Files

| File | Purpose |
|------|---------|
| `src/api/client.js` | Axios instance — `withCredentials: true`, `baseURL: /api`. The only correct way to make API calls; never use `Authorization` headers. |
| `src/store/authStore.js` | Zustand auth store. Auth lives in HttpOnly cookie — no tokens in localStorage. `checkAuth()` calls `GET /verify`. |
| `src/components/ProtectedRoute.jsx` | Calls `checkAuth()` before rendering admin routes. Call `checkAuth()` only here, not in `App.jsx`. |
| `src/api/galleryService.js` | Gallery API calls (list, upload, edit, delete) |
| `nginx.conf` | Baked into Docker image. Maps each `/api/<route>` explicitly to `fastapi:8001/`. **Must be updated when new API routes are added.** |

## Routes

| Path | Notes |
|------|-------|
| `/` | Public landing page |
| `/admin/login` | Login form |
| `/admin` | Protected — gallery management dashboard |

## nginx.conf Note

This file handles API proxying in production. Each API endpoint is mapped individually (not via a wildcard strip). When a new backend route is added, add the corresponding block here:

```nginx
location /api/new-route {
    proxy_pass http://fastapi:8001/new-route;
    ...
}
```

## Important Constraints

- Never add a proxy in `vite.config.js` — proxying is nginx's job.
- Never store auth tokens in localStorage or sessionStorage.
- Rate limiting is enforced at the nginx level (contact: 1r/m, login: 5r/m, admin: 20r/m) — do not try to bypass or mock these in dev.
