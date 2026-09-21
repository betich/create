#!/usr/bin/env node
import * as p from '@clack/prompts'
import { spawnSync } from 'node:child_process'
import { relative } from 'node:path'
import { interview } from './interview.js'
import { kickoffPrompt } from './kickoff-prompt.js'
import { scaffold } from './scaffold.js'
import { installSkills } from './skills.js'

const clipboards: [string, string[]][] = [
  ['pbcopy', []],
  ['wl-copy', []],
  ['xclip', ['-selection', 'clipboard']],
  ['clip.exe', []],
]

function copy(text: string): boolean {
  return clipboards.some(([cmd, args]) => spawnSync(cmd, args, { input: text }).status === 0)
}

p.intro('@betichh/create')
const answers = await interview(process.argv[2])

const written = await scaffold(answers)
if (written.length) {
  p.note(written.map((w) => `${w.status.padEnd(7)} ${w.path}`).join('\n'), relative(process.cwd(), answers.dir) || '.')
}

if (answers.skills.length) {
  const failed = await installSkills(answers.dir, answers.skills)
  if (failed.length) p.log.warn(`Could not install: ${failed.join(', ')}. Retry with npx skills add.`)
}

const prompt = kickoffPrompt(answers)
p.note(prompt, 'Kickoff prompt')

const next = await p.select({
  message: 'Jump in?',
  options: [
    { value: 'launch', label: 'Start claude with this prompt' },
    { value: 'copy', label: 'Copy the prompt' },
    { value: 'done', label: 'Done' },
  ],
})

if (next === 'copy') p.log.info(copy(prompt) ? 'Copied.' : 'No clipboard found. The prompt is above.')
p.outro(`cd ${relative(process.cwd(), answers.dir) || '.'}`)

if (next === 'launch') {
  const result = spawnSync('claude', [prompt], { cwd: answers.dir, stdio: 'inherit' })
  if (result.error) console.error('claude is not on PATH. The prompt is above.')
}
