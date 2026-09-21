# Stacks

The frontend is always Vite, React and TypeScript (see `template/docs/coding-style.md`). The backend depends on where the app runs.

| Stack | Pick it when | Data | Deploy |
|---|---|---|---|
| **`elysia`** (default) | the default case, when types should flow from server to client | Drizzle on SQLite or Postgres | Docker, or behind a Cloudflare Tunnel |
| **`cloudflare`** | it should be nearly free and needs no box | D1, R2, KV | Workers, and Pages for the SPA |
| **`pocketbase`** | you want auth, files, realtime and an admin UI for free | PocketBase SQLite | one Go binary with the SPA embedded |

In all three:

- The whole app runs from root commands (`mise run setup | dev | check | build`). `mise.toml` pins the toolchain, and in the Elysia and PocketBase stacks there's a `Dockerfile`.
- The API client is the only place that calls `fetch`, and its types come from the server: Eden for Elysia, Hono `hc` for Workers, generated types for PocketBase.
- Auth follows [`auth.md`](auth.md).

For the frontend package manager, use `bun` when the backend is Elysia. Otherwise `pnpm` is the default and `npm` is fine.
