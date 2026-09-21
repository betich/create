import * as p from '@clack/prompts'
import { spawn } from 'node:child_process'
import { skillSets, type SkillSet } from './answers.js'

function add(dir: string, source: string): Promise<boolean> {
  return new Promise((done) => {
    const child = spawn('npx', ['-y', 'skills', 'add', source, '-y'], { cwd: dir, stdio: 'ignore' })
    child.on('error', () => done(false))
    child.on('close', (code) => done(code === 0))
  })
}

export async function installSkills(dir: string, sets: SkillSet[]): Promise<SkillSet[]> {
  const failed: SkillSet[] = []
  for (const set of sets) {
    const source = set === 'style' ? (process.env.STYLE_SOURCE ?? skillSets.style.source) : skillSets[set].source
    const spin = p.spinner()
    spin.start(`skills add ${source}`)
    const ok = await add(dir, source)
    spin.stop(ok ? source : `${source} failed`, ok ? 0 : 1)
    if (!ok) failed.push(set)
  }
  return failed
}
