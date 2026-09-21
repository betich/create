# style

[![npm](https://img.shields.io/npm/v/@betichh/create)](https://www.npmjs.com/package/@betichh/create)

My defaults for building projects with coding agents, kept in one repo. They're opinionated on purpose. The repo is published to npm as [`@betichh/create`](https://www.npmjs.com/package/@betichh/create).

```sh
npm create @betichh@latest my-app     # or: bunx @betichh/create my-app / pnpm create @betichh my-app
```

The command runs a short interview in the terminal, writes the project docs from your answers, installs the skills, and ends with a kickoff prompt that you can launch straight into `claude`.

## What the interview asks

- **The product:** what it is in one line, who uses it, the job it does for them, and any domains you already see.
- **Workflow:** issue-driven (GitHub Issues) or spec-driven (`SPEC.md` with spec ids).
- **Stack:** `elysia` (the default), `cloudflare` or `pocketbase`, plus the package manager, backend structure and auth.
- **Voice:** the languages (Thai first with an English toggle, Thai only, or English only) and the brand personality.
- **Setup:** which skill sets to install, and whether to run `git init`.

## What it writes

The answers go into `docs/brief.md`. The template in [`template/`](template/) is filled in and copied, and `CLAUDE.md` is created as a symlink to `AGENTS.md`. The stack preset from [`stacks/`](stacks/) goes into `mise.toml` and `docs/stack.md`. Existing files are never overwritten, so the command is safe to run on a project that already exists.

## In an existing project

When the folder already has files, the interview starts with a checklist: agent docs, stack preset, skills and `git init`. Each item shows whether it's already there, and whatever is missing is checked by default. It only asks the questions the checked items need. For example, the stack preset alone just asks for the stack. Installed skill sets are read from `skills-lock.json` and left unchecked.

## The kickoff prompt

The kickoff prompt is built from the brief and starts `/kickoff`, which runs the steps that need a conversation:

1. `setup-matt-pocock-skills`
2. `grill-with-docs`, which writes `CONTEXT.md` and the ADRs. It doesn't re-ask anything that's already in the brief.
3. `impeccable init`, which writes `PRODUCT.md`
4. Scaffolding the stack with its official generators, then reshaping it to fit `docs/coding-style.md`
5. `domain-experts`, which writes one `.claude/agents/<domain>-expert.md` per domain
6. The first surface: make it work, then lay it out, then make it bolder with `impeccable`

## Skill sets

| Source | For |
|---|---|
| `mattpocock/skills` | grilling, domain modelling, to-spec, to-tickets, tdd, code review |
| `pbakaus/impeccable` | design: init, new work, critique, polish |
| `chakrit/kien-thai` | natural Thai prose |
| `betich/style` ([`skills/`](skills/)) | kickoff, domain-experts, thai-ux-copy |

To test unpublished skill changes, set `STYLE_SOURCE=/path/to/style` and the scaffold installs this repo's skills from that path instead of GitHub.

## Developing

```sh
pnpm install
pnpm test                 # build and scaffold every stack into a temp dir
pnpm dev ../scratch-app   # run the interview for real
npm version patch         # bump before every release
npm publish --otp=<code>  # prepublishOnly runs the tests
```
