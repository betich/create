---
name: kickoff
description: Take a freshly scaffolded project (from create-betich) from idea to first running screen — product context, domain docs, stack scaffold, domain expert agents, first design. Use when the user says kickoff, start the project, set up this new project, or when a create-betich kickoff prompt arrives.
disable-model-invocation: true
---

# Kickoff

Run these steps in order, and skip any step whose output already exists. Check with the user between steps, but don't grill: when the user says something is simple, take it as given.

## 0. Read what the scaffold wrote

Read `docs/brief.md`, `AGENTS.md`, `mise.toml` and `docs/`. The brief has the interview answers: the product, its users, the job it does, the domains, the stack, the workflow and the voice. Treat those as decided, and don't ask about them again.

## 1. The idea

Where the brief is thin, ask about the capabilities: what the product does and the metaphor it follows. Keep this to one short round of questions.

## 2. Agent skills setup

Run `setup-matt-pocock-skills`. The defaults are GitHub Issues, the default triage labels, and single-context docs.

## 3. Domain

Run `grill-with-docs` until `CONTEXT.md` names the core domain terms, and until the stack choice and backend structure (simple, module-service-controller or DDD) are recorded as ADRs in `docs/adr/`.

## 4. Product

Run `impeccable init` to write `PRODUCT.md`. Then fill in `docs/copywriting.md`: the voice comes from the brand personality in `PRODUCT.md`, and the glossary from `CONTEXT.md`.

## 5. Scaffold

Follow `docs/stack.md`. Use the official generators, then reshape the result to fit `docs/coding-style.md`:

- the `features/`, `shared/components/` and `lib/api/` folders exist
- a single typed API client exists, and one example feature runs end to end: a page, a hook, and a view that takes props
- `mise run setup`, `mise run dev` and `mise run check` all work from a clean clone

Commit when the user asks you to.

## 6. Domain experts

Once `CONTEXT.md` and a spec or first tickets exist, run `domain-experts`. If the domains aren't clear yet, skip this step and tell the user to run it later.

## 7. First surface

Build the first surface with `impeccable`, following the steps in `docs/workflow.md`: function, then layout, then bolden. `impeccable` writes `DESIGN.md` from the result.
