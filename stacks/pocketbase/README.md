# Stack: PocketBase (self-hosted)

PocketBase is used as a Go framework, not as the prebuilt binary. It provides SQLite, auth with OAuth2, file storage, realtime and an admin UI. The built SPA is embedded with `go:embed`, so a single binary serves everything from one origin.

```
frontend/   vite + react + pocketbase js sdk
server/     go: main.go, migrations/, internal/domain/ (pure, no pocketbase imports)
```

## Rules

- Schema changes go in a new file under `server/migrations/`, and after each one run `mise run typegen` to regenerate `frontend/src/lib/pocketbase-types.ts`.
- Anything beyond CRUD goes in Go hooks. Pure rules go in `server/internal/domain/` and are tested without PocketBase.
- The frontend reads data through TanStack Query hooks that wrap the typed SDK, never through the SDK inside a component.
- Put local auth bypass behind `AUTH_BYPASS=true` and a Go build tag, and leave the tag out of production builds.

## Deploy

A multi-stage `Dockerfile` builds the SPA, then the Go binary, into a distroless image. The data directory is a volume.
