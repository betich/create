# Stack: Elysia (default)

Bun, Elysia and Drizzle on the server; Vite, React and TanStack Query on the client. The client imports the server's `App` type, so a change to a route breaks the frontend's typecheck.

```
apps/api/     bun + elysia + drizzle   :8787
apps/web/     vite + react             :5173, proxies /api in dev
packages/shared/   pure types and logic both sides use (only when needed)
```

## Scaffold

```sh
bun create elysia apps/api
bun create vite apps/web --template react-ts
```

Root `package.json` uses workspaces `["apps/*", "packages/*"]`, and these scripts:

```json
"dev": "bun run --filter '*' dev",
"build": "bun run --filter '*' build",
"typecheck": "bun run --filter '*' typecheck",
"test": "bun run --filter '*' test",
"lint": "bun run --filter '*' lint"
```

## Rules

- Export `type App = typeof app` from `apps/api/src/index.ts`. In `apps/web/src/lib/api/client.ts`, call `treaty<App>(...)`. That file is the only place the web app talks to the API.
- Validate every route with Elysia's `t` schema, and write the Drizzle schema in `apps/api/src/db/schema.ts`.
- **Database:** use SQLite (`bun:sqlite` + `drizzle-orm/bun-sqlite`) until you need concurrent writers or managed hosting. After that, use Postgres (`drizzle-orm/postgres-js`) through `docker-compose.yml`.
- Migrations are generated with `drizzle-kit generate` and committed. They're never pushed straight to production.
- If the server is optional, as in tools.betich.me, every feature that needs it degrades with a message instead of throwing.

## Deploy

`Dockerfile` + `docker-compose.yml` (api, and db if you use Postgres). Put the SPA on Cloudflare Pages, or serve it from Elysia with `@elysiajs/static` so everything runs on one origin.
