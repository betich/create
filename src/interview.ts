import * as p from '@clack/prompts'
import { basename, resolve } from 'node:path'
import {
  auths,
  backends,
  languages,
  packageManagers,
  parts,
  skillSets,
  stacks,
  workflows,
  type Answers,
  type Auth,
  type Brief,
  type Language,
  type PackageManager,
  type Part,
  type SkillSet,
  type StackChoice,
} from './answers.js'
import { detect, installedSkills, isExistingProject, type PartState } from './detect.js'

function options<T extends string>(record: Record<T, string | { label: string }>) {
  return (Object.keys(record) as T[]).map((value) => {
    const entry = record[value]
    return { value, label: typeof entry === 'string' ? entry : entry.label }
  })
}

function orExit<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Nothing written.')
    process.exit(0)
  }
  return value
}

const required = (value: string | undefined) => (value?.trim() ? undefined : 'Needed for the brief.')

const stateHint: Record<PartState, string | undefined> = {
  missing: undefined,
  partial: 'partly there, fills the gaps',
  done: 'already there',
}

async function pickParts(dir: string): Promise<Part[]> {
  const states = await detect(dir)
  const all = Object.keys(parts) as Part[]
  return orExit(
    await p.multiselect<Part>({
      message: 'This folder already has files. What should I set up? Existing files are kept.',
      options: all.map((value) => ({
        value,
        label: parts[value],
        hint: value === 'skills' && states.skills === 'partial' ? 'some installed' : stateHint[states[value]],
      })),
      initialValues: all.filter((part) => states[part] !== 'done'),
      required: true,
    }),
  )
}

async function askProduct() {
  p.log.step('The product')
  const oneLiner = orExit(await p.text({ message: 'What is it, in one line?', validate: required }))
  const users = orExit(await p.text({ message: 'Who uses it, and where do they arrive from?', validate: required }))
  const job = orExit(
    await p.text({ message: 'The job it does for them?', placeholder: 'Log today in under 30 seconds…', validate: required }),
  )
  const domains = orExit(
    await p.text({ message: 'Domains you already see? (comma separated, optional)', placeholder: 'registration, leaderboard, admin' }),
  )
  const workflow = orExit(await p.select({ message: 'How is work tracked?', options: options(workflows) }))
  return {
    oneLiner,
    users,
    job,
    domains: (domains ?? '')
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean),
    workflow,
  }
}

async function askStack(): Promise<StackChoice> {
  const stack = orExit(await p.select({ message: 'Stack', options: options(stacks), initialValue: 'elysia' as const }))
  const pm: PackageManager =
    stack === 'elysia'
      ? 'bun'
      : orExit(await p.select({ message: 'Package manager', options: options(packageManagers), initialValue: 'pnpm' as const }))
  return { stack, pm }
}

async function askStructure(stack: StackChoice) {
  const backend = orExit(await p.select({ message: 'Backend structure', options: options(backends) }))
  const authChoices = options(auths).filter((o) => o.value !== 'pocketbase' || stack.stack === 'pocketbase')
  const auth: Auth[] = orExit(
    await p.multiselect({
      message: 'Auth',
      options: authChoices,
      initialValues: stack.stack === 'pocketbase' ? ['pocketbase'] : ['google'],
      required: false,
    }),
  )
  return { backend, auth }
}

async function askVoice() {
  p.log.step('Voice')
  const language = orExit(await p.select({ message: 'Languages', options: options(languages) }))
  const voice = orExit(
    await p.text({ message: 'Brand personality in three words?', placeholder: 'Playful, civic, everyday', validate: required }),
  )
  return { language, voice }
}

async function askSkills(dir: string, language: Language | undefined): Promise<SkillSet[]> {
  const installed = await installedSkills(dir)
  const defaults: SkillSet[] = (['matt', 'impeccable', 'kienThai', 'style'] as const).filter(
    (set) => !installed.includes(set) && !(set === 'kienThai' && language === 'en'),
  )
  return orExit(
    await p.multiselect<SkillSet>({
      message: 'Install skills into the project',
      options: options(skillSets).map((o) => ({ ...o, hint: installed.includes(o.value) ? 'installed' : undefined })),
      initialValues: defaults,
      required: false,
    }),
  )
}

export async function interview(dirArg: string | undefined): Promise<Answers> {
  const dir = resolve(
    dirArg ??
      orExit(await p.text({ message: 'Where should it go?', placeholder: './my-app', validate: required })),
  )
  const existing = await isExistingProject(dir)
  const chosen = existing ? await pickParts(dir) : (Object.keys(parts) as Part[])
  const wants = (part: Part) => chosen.includes(part)

  let brief: Brief | undefined
  let stack: StackChoice | undefined
  if (wants('docs')) {
    const product = await askProduct()
    p.log.step('The stack')
    stack = await askStack()
    const structure = await askStructure(stack)
    brief = { ...product, ...structure, ...(await askVoice()) }
  } else if (wants('stack')) {
    p.log.step('The stack')
    stack = await askStack()
  }

  let skills: SkillSet[] = []
  if (wants('skills')) {
    p.log.step('Setup')
    skills = await askSkills(dir, brief?.language)
  }
  // An existing project answered this in the checklist.
  const git = existing ? wants('git') : orExit(await p.confirm({ message: 'git init?', initialValue: true }))

  return {
    dir,
    name: basename(dir),
    parts: chosen.filter((part) => part !== 'git' || git),
    stack,
    brief,
    skills,
  }
}
