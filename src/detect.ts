import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { skillSets, type Part, type SkillSet } from './answers.js'
import { templateFiles } from './scaffold.js'

export type PartState = 'missing' | 'partial' | 'done'

// One skill per set, for installs that predate skills-lock.json.
const markers: Partial<Record<SkillSet, string>> = {
  matt: 'grilling',
  impeccable: 'impeccable',
  style: 'kickoff',
}

const stackPaths = ['mise.toml', 'docs/stack.md', 'docs/auth.md']

export async function isExistingProject(dir: string): Promise<boolean> {
  return existsSync(dir) && (await readdir(dir)).length > 0
}

export async function installedSkills(dir: string): Promise<SkillSet[]> {
  let sources: string[] = []
  try {
    const lock = JSON.parse(await readFile(join(dir, 'skills-lock.json'), 'utf8'))
    sources = Object.values<{ source?: string }>(lock.skills ?? {}).map((s) => s.source ?? '')
  } catch {}
  return (Object.keys(skillSets) as SkillSet[]).filter((set) => {
    const marker = markers[set]
    return (
      sources.includes(skillSets[set].source) ||
      (marker && ['.agents', '.claude'].some((root) => existsSync(join(dir, root, 'skills', marker))))
    )
  })
}

function state(dir: string, paths: string[]): PartState {
  const present = paths.filter((p) => existsSync(join(dir, p))).length
  return present === 0 ? 'missing' : present === paths.length ? 'done' : 'partial'
}

export async function detect(dir: string): Promise<Record<Part, PartState>> {
  // .gitkeep files go once the folder has real content.
  const docs = [...(await templateFiles()).map(([, dest]) => dest), 'CLAUDE.md'].filter((p) => !p.endsWith('.gitkeep'))
  const skills = (await installedSkills(dir)).length
  return {
    docs: state(dir, docs),
    stack: state(dir, stackPaths),
    skills: skills === 0 ? 'missing' : skills === Object.keys(skillSets).length ? 'done' : 'partial',
    git: existsSync(join(dir, '.git')) ? 'done' : 'missing',
  }
}
