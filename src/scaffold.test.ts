import assert from 'node:assert/strict'
import { lstat, mkdtemp, readFile, readlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import type { Answers, Stack } from './answers.js'
import { kickoffPrompt } from './kickoff-prompt.js'
import { render } from './render.js'
import { scaffold } from './scaffold.js'

const answers = (dir: string, stack: Stack = 'elysia'): Answers => ({
  dir,
  name: 'demo',
  oneLiner: 'A demo app.',
  users: 'Bangkok commuters',
  job: 'Log a walk fast',
  domains: ['logging', 'leaderboard'],
  workflow: 'issues',
  stack,
  pm: stack === 'elysia' ? 'bun' : 'pnpm',
  backend: 'simple',
  auth: ['google', 'line'],
  language: 'th-en',
  voice: 'Playful, civic, everyday',
  skills: [],
  git: false,
})

test('render refuses to leave a placeholder behind', () => {
  assert.throws(() => render('{{A}} {{B}}', { A: 'x' }), /needs B/)
})

for (const stack of ['elysia', 'cloudflare', 'pocketbase'] as const) {
  test(`scaffolds ${stack} with every placeholder filled`, async () => {
    const dir = await mkdtemp(join(tmpdir(), 'create-betich-'))
    await scaffold(answers(dir, stack))

    for (const file of ['AGENTS.md', 'docs/brief.md', 'docs/copywriting.md', 'docs/stack.md', 'mise.toml']) {
      assert.doesNotMatch(await readFile(join(dir, file), 'utf8'), /\{\{/, file)
    }
    assert.equal(await readlink(join(dir, 'CLAUDE.md')), 'AGENTS.md')
    assert.ok((await lstat(join(dir, '.gitignore'))).isFile())
  })
}

test('never overwrites an existing file', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'create-betich-'))
  await writeFile(join(dir, 'AGENTS.md'), 'mine')
  const written = await scaffold(answers(dir))

  assert.equal(await readFile(join(dir, 'AGENTS.md'), 'utf8'), 'mine')
  assert.ok(written.some((w) => w.path === 'AGENTS.md' && w.status === 'kept'))
})

test('kickoff prompt carries the brief and the first move', () => {
  const prompt = kickoffPrompt(answers('/x'))
  assert.match(prompt, /^\/kickoff/)
  assert.match(prompt, /logging, leaderboard/)
  assert.match(prompt, /to-tickets/)
})
