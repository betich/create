# Coding style

## General

- Write code that explains itself: a good name beats a comment.
- Comments are rare and short, at most two lines, and they say *why*, never *what*. If explaining something takes a paragraph, it belongs in an ADR (`docs/adr/`) and the comment links to it.
- Types are strict end to end: `strict: true`, no `any`, and no `as` except at a parsing boundary. Validate input at the edge (Zod, TypeBox or Valibot) and trust the types inside.
- Build nothing speculative: no abstraction until a second caller exists, and no config nobody asked for.
- Files are kebab-case, and components are PascalCase inside them.

## Frontend: Vite, React, TypeScript

```
src/
  app/                  router, providers, root layout
  pages/                route shims: read params, render a view
  features/<feature>/
    views/              full-page views, data comes in as props
    sections/           chunks of a view, built from shared components
    hooks/              the feature's data and state (use-*.ts)
    lib/                pure logic, no React
  shared/
    components/{atoms,molecules,organisms}/
    hooks/              hooks more than one feature needs
  lib/
    api/                typed client, query keys, shared queries
    utils.ts
```

- **The data flow runs one way:** a page calls a hook, the hook returns data, and a view renders it. Views and sections take props and never fetch, so any of them can be rendered in Storybook or a test with fixtures.
- **Don't build the same thing twice.** Before writing a component, check `shared/components`. A section moves into `shared/` when a second feature needs it, not before.
- **Data goes through hooks, never through components.** Every server read goes through TanStack Query, with query keys from one factory. Don't write `useState` + `useEffect` + `fetch` for reads.
- **Only one module calls `fetch`: the API client in `lib/api/`.** With Elysia this is the Eden treaty client, and the types come from the server.
- Features never import from each other. Shared code goes in `shared/` (UI) or `lib/` (logic).
- Don't put barrel `index.ts` files inside `features/`. They're fine in `shared/components/*`.
- Style with Tailwind v4 and semantic tokens from `DESIGN.md`, and never write a raw hex value in a component. Build variants with `cva` and `cn()`.

## Backend

The layout depends on the project. Pick one of these, record it in an ADR, and hold to it:

- **Simple** has `routes/`, `lib/` and `db/`. Use it for a handful of endpoints.
- **Module, service, controller** has `modules/<module>/{<module>.controller.ts, <module>.service.ts, <module>.schema.ts}`.
- **Domain-driven** has `domain/`, which is pure with no framework imports, plus `app/` for use cases and `infra/` for db, http and external services.

Whichever layout you pick, keep pure rules (pricing, eligibility, scoring) away from the framework and the database so they can be tested without either.

## Tests

- Test behaviour through public interfaces. Pure logic gets unit tests, and user journeys get a small set of e2e tests.
- For a bug fix, start with a failing test that reproduces the bug.
