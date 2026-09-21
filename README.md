# style

My defaults for building projects with coding agents, kept in one repo. They're opinionated on purpose.

- **`template/`** holds what every new project starts with: `AGENTS.md`, coding style, design and copy rules, Claude settings and an ADR folder.
- **`skills/`** holds my own skills. They install with `npx skills add betich/style`.
- **`stacks/`** holds the stack presets and when to pick each one.
- **`bin/new`** starts a new project from all of the above.

## Start a project

```sh
~/code/style/bin/new ~/code/my-app --stack elysia --pm bun
cd ~/code/my-app && claude
> /kickoff
```

`bin/new` copies `template/`, fills in the project name, stack and package manager, runs `git init`, and installs the skill set into the project so the skills are pinned in `skills-lock.json`. `/kickoff` then runs the steps that need a conversation, in order:

1. `setup-matt-pocock-skills`: sets the issue tracker, triage labels and domain docs.
2. `grill-with-docs`: turns the idea into `CONTEXT.md` and the first ADRs.
3. `impeccable init`: writes `PRODUCT.md` (users, register, brand, anti-references).
4. Scaffolds the chosen stack with its official generator, then shapes it to `docs/coding-style.md`.
5. `domain-experts`: writes one `.claude/agents/<domain>-expert.md` for each product domain once the domains are clear.
6. `impeccable` new work: produces the first surface and `DESIGN.md`.

## Apply to an existing project

```sh
~/code/style/bin/new . --stack pocketbase   # never overwrites an existing file
```

## Skill set

| Source | Skills | For |
|---|---|---|
| `mattpocock/skills` | grilling, domain-modeling, to-spec, to-tickets, tdd, code-review, … | the engineering loop, ADRs and `CONTEXT.md` |
| `pbakaus/impeccable` | impeccable | design: init, new work, critique, polish |
| `chakrit/kien-thai` | kien-thai, kode-thai | natural Thai prose: docs, landing copy, translation |
| `betich/style` | kickoff, domain-experts, thai-ux-copy | this repo: project setup, domain experts, Thai UI strings |

Stacks: [`stacks/README.md`](stacks/README.md).

## Other ways to distribute this

- **GitHub template repo.** Mark `template/` as its own repo and use "Use this template". It's simpler, but you lose `--stack` and can't apply it to an existing project.
- **Claude Code plugin marketplace.** Add `.claude-plugin/marketplace.json` so the skills and agents install with `/plugin install`. This is worth doing if the skills should be available globally instead of pinned per project.
