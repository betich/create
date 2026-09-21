# style

This repo holds my defaults. It's published to npm as `create-betich`, a terminal interview that scaffolds a project (`src/`). `template/` is rendered into new projects, `stacks/` holds the stack presets, and `skills/` is installed with `npx skills add betich/style`.

- Edit the template the same way you'd edit a live project's docs: keep it short and make every rule something an agent can act on.
- A rule belongs in exactly one place. Stack-specific rules go in `stacks/`, and rules that apply to every project go in `template/docs/`.
- Before editing a skill, load the `writing-for-agents` skill.
- The scaffold never overwrites a file that already exists in the target.
- Template placeholders are `{{KEY}}`, and `render` throws when a key is missing. When you add a placeholder, add it to `src/vars.ts` too.
- The template ships `gitignore` without the dot because npm strips `.gitignore`. The file is renamed when it's copied.
- `CLAUDE.md` is always a symlink to `AGENTS.md`.
- Run `pnpm test` before publishing.
