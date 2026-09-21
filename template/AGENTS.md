# {{NAME}}

{{ONE_LINER}}

@docs/coding-style.md
@docs/workflow.md

## Context

- **`docs/brief.md`** is the original brief from the scaffold interview. `PRODUCT.md` and `CONTEXT.md` replace it once they exist.
- **`PRODUCT.md`** says who the product is for and why it exists. It's written by `impeccable init`.
- **`DESIGN.md`** is the design system. It's written by `impeccable`, and it's authoritative once code exists.
- **`CONTEXT.md`** is the domain language, and **`docs/adr/`** records decisions. Before naming anything, read `CONTEXT.md`.
- **`docs/design.md`** and **`docs/copywriting.md`**: read these before any UI or copy work.

## Stack

{{STACK_SUMMARY}} Details: `docs/stack.md`.

- **Backend structure:** {{BACKEND}}
- **Auth:** {{AUTH}}
- **Package manager:** {{PM}}

## Workflow

{{WORKFLOW}} See `docs/workflow.md`.

## Commands

Run everything from the root. `mise tasks` lists the commands.

```sh
mise run setup      # install deps, env files, hooks
mise run dev        # everything, with hot reload
mise run check      # format, lint, typecheck, test
mise run build
```

Before committing, run `mise run check` and make sure it passes.

## Agents

`.claude/agents/` has one expert per product domain, and each one is written by the `domain-experts` skill. When a task sits inside a single domain, hand it to that domain's expert.

## Agent skills

`setup-matt-pocock-skills` fills this section in.
