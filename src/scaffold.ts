import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, symlink, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Answers, Stack } from './answers.js'
import { render } from './render.js'
import { toVars } from './vars.js'

export const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

// npm strips .gitignore from published tarballs, so the template ships it without the dot.
const renames: Record<string, string> = { gitignore: '.gitignore' }

export interface Written {
  path: string
  status: 'created' | 'kept' | 'linked'
}

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

export async function stackSummary(stack: Stack): Promise<string> {
  const readme = await readFile(join(packageRoot, 'stacks', stack, 'README.md'), 'utf8')
  return readme.split('\n').find((line) => line.trim() && !line.startsWith('#')) ?? ''
}

export async function scaffold(a: Answers): Promise<Written[]> {
  const vars = toVars(a, await stackSummary(a.stack))
  const written: Written[] = []

  const place = async (source: string, dest: string) => {
    const target = join(a.dir, dest)
    if (existsSync(target)) return written.push({ path: dest, status: 'kept' })
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, render(await readFile(source, 'utf8'), vars))
    written.push({ path: dest, status: 'created' })
  }

  const templateDir = join(packageRoot, 'template')
  for await (const file of walk(templateDir)) {
    const rel = relative(templateDir, file)
    const name = renames[rel.split('/').pop() ?? ''] ?? null
    await place(file, name ? join(dirname(rel), name) : rel)
  }

  const stackDir = join(packageRoot, 'stacks', a.stack)
  await place(join(stackDir, 'mise.toml'), 'mise.toml')
  await place(join(stackDir, 'README.md'), 'docs/stack.md')
  await place(join(packageRoot, 'stacks', 'auth.md'), 'docs/auth.md')

  if (!existsSync(join(a.dir, 'CLAUDE.md'))) {
    await symlink('AGENTS.md', join(a.dir, 'CLAUDE.md'))
    written.push({ path: 'CLAUDE.md → AGENTS.md', status: 'linked' })
  }

  if (a.git && !existsSync(join(a.dir, '.git'))) {
    execFileSync('git', ['init', '-q'], { cwd: a.dir })
  }

  return written
}
