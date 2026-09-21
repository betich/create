---
name: domain-experts
description: Generate or refresh Claude Code subagents (.claude/agents/<domain>-expert.md) that each own one product domain — its specs, files, invariants and past mistakes. Use when the product domains are fleshed out (CONTEXT.md, specs or tickets exist), when the user asks for domain experts or expert agents, or when an existing expert has drifted from the code.
---

# Domain experts

An expert is a subagent that knows one part of the product well: which specs apply, where the code lives, and which rules break easily. Its value comes from the specifics, so an expert that only repeats `AGENTS.md` adds nothing.

## 1. Find the domains

Read `CONTEXT.md`, `SPEC.md` or `docs/specs/`, open issues (`gh issue list`), `docs/adr/`, and the `features/` and backend module folders. A domain is a product surface or journey with its own vocabulary and rules, like *registration*, *leaderboard* or *admin studio*. It isn't a technical layer like *frontend* or *database*. The one exception is the platform: a single `backend-expert` is fine when the API is shared.

Suggest 3–6 domains and one journey expert for any flow that crosses several of them. Confirm the list with the user before writing anything.

## 2. Write each expert

Save each one to `.claude/agents/<domain>-expert.md`:

```markdown
---
name: <domain>-expert
description: >
  Use for <the surfaces, routes and entities this owns, named concretely>.
  Use when <the kind of change or bug that lands here>. Specs <ids>.
tools: Bash, Read, Edit, Write, Grep, Glob
---

You are the engineer who owns <domain> at <product>, from <start of the journey> to <end>.

## Read before you act
- <spec ids or issues, in reading order>
- <ADRs that constrain this domain>

## The map
| Layer | Where |
|---|---|
| Server | <paths> |
| Pure rules | <paths> |
| Client calls | <paths> |
| Views and sections | <paths> |

## The rules, and which ones bite
<Invariants, each with the file that enforces it and how it has broken before. Name the single source of truth and warn never to re-derive it.>

## Copy and design
<Terms from the glossary this domain uses, and the key information and CTA of each of its surfaces.>

## Done means
<The checks this domain needs beyond `mise run check`.>
```

- Base every path and rule on what exists now, and check each path is real with Glob before writing it down.
- Where there's no code yet, write what the spec intends and mark it `(planned)`.
- An expert should run to 60–150 lines. When it grows past that, split the domain.

## 3. Wire them in

Update `## Agents` in `AGENTS.md` with a list of each expert and the spec group it covers.

## Refreshing

When an expert has drifted from the code, rerun step 2 for that domain only. Keep the "which ones bite" entries that still apply, because that history is the hardest part to rebuild.
