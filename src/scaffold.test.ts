import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { lstat, mkdir, mkdtemp, readFile, readlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import type { Answers, Part, Stack } from './answers.js'
import { detect, installedSkills } from './detect.js'
import { kickoffPrompt } from './kickoff-prompt.js'
import { render } from './render.js'
import { scaffold } from './scaffold.js'

const answers = (dir: string, stack: Stack = 'elysia', parts: Part[] = ['docs', 'stack']): Answers => ({
  dir,
  name: 'demo',
  parts,
  stack: { stack, pm: stack === 'elysia' ? 'bun' : 'pnpm' },
  brief: {
    oneLiner: 'A demo app.',
    users: 'Bangkok commuters',
    job: 'Log a walk fast',
    domains: ['logging', 'leaderboard'],
    workflow: 'issues',
    backend: 'simple',
    auth: ['google', 'line'],
    language: 'th-en',
    voice: 'Playful, civic, everyday',
  },
  skills: [],
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

test('writes only the chosen parts, with only the answers they need', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'create-betich-'))
  const { brief: _, ...stackOnly } = answers(dir, 'cloudflare', ['stack'])
  await scaffold(stackOnly)

  assert.ok(existsSync(join(dir, 'mise.toml')))
  assert.ok(!existsSync(join(dir, 'AGENTS.md')))
  const states = await detect(dir)
  assert.equal(states.stack, 'done')
  assert.equal(states.docs, 'missing')
})

test('detects a partly scaffolded project', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'create-betich-'))
  await writeFile(join(dir, 'AGENTS.md'), 'mine')
  await mkdir(join(dir, '.git'))
  const states = await detect(dir)
  assert.deepEqual(states, { docs: 'partial', stack: 'missing', skills: 'missing', git: 'done' })

  await scaffold(answers(dir))
  assert.equal((await detect(dir)).docs, 'done')
})

test('detects installed skill sets from the lock file and skill folders', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'create-betich-'))
  await writeFile(join(dir, 'skills-lock.json'), JSON.stringify({ skills: { tdd: { source: 'mattpocock/skills' } } }))
  await mkdir(join(dir, '.claude/skills/impeccable'), { recursive: true })
  assert.deepEqual(await installedSkills(dir), ['matt', 'impeccable'])
})

test('kickoff prompt without a brief points at the existing docs', () => {
  const { brief: _, ...a } = answers('/x', 'elysia', ['stack'])
  assert.match(kickoffPrompt(a), /already exists/)
})
