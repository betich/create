# Workflow

Work is either **spec-driven** or **issue-driven**, and `AGENTS.md` says which one this repo uses.

## Spec-driven

Use this when the product is known up front: client work, or a fixed scope.

- `SPEC.md` is the index, and the specs themselves live in `docs/specs/<group>/NN-<slug>.md`.
- Specs are cited by id (`APP-03`, `BE-07`) everywhere: in commits, comments and agent prompts.
- Update the spec *before* changing behaviour. If code and spec disagree, the spec wins until someone edits it.
- `to-spec` turns a conversation into a spec, and `implement-spec` builds from one.

## Issue-driven

Use this when the product grows as you build it: personal projects and tools.

- Issues live in GitHub Issues and move through `triage` labels.
- `to-tickets` breaks a plan into issues, with one branch and one PR per issue.
- Commits and PRs reference the issue number, for example `(#42)`.

## Building a feature

1. **Capabilities.** List what the feature does, what it runs on, and the metaphor it follows (a bench, a room, like Figma). Don't design it yet.
2. **Grill, lightly.** Use `grilling` or `grill-with-docs` until the scope is clear. Keep it short, and once the user says the scope is simple, stop asking questions.
3. **Spec or tickets.** Write it up as a parent issue (the spec) with tickets underneath, or as a `docs/specs/` file. Deferred work is ticketed as `Later: …`.
4. **Function.** Build every ticket end to end in plain UI, getting the data flow and every state right (loading, empty, error, disabled). Independent tickets can be built in parallel worktrees.
5. **Layout.** Run `impeccable` against the One-Screen Rule (`docs/design.md`).
6. **Bolden.** Run `impeccable` again so the CTA and key information are clear as day. Make key information large, and in personal projects push it as far as you like.
7. **Use it.** Fix whatever the screenshots show, then ship.

## Commits

Use Conventional Commits, with the subject written as a result: `feat(merge): pages can be dragged across files (#42)`. Commit and push only when asked.
