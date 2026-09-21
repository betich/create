import * as p from '@clack/prompts'
import { basename, resolve } from 'node:path'
import {
  auths,
  backends,
  languages,
  packageManagers,
  skillSets,
  stacks,
  workflows,
  type Answers,
  type Auth,
  type PackageManager,
  type SkillSet,
} from './answers.js'

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

export async function interview(dirArg: string | undefined): Promise<Answers> {
  const dir = resolve(
    dirArg ??
      orExit(await p.text({ message: 'Where should it go?', placeholder: './my-app', validate: required })),
  )

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

  p.log.step('The stack')
  const stack = orExit(await p.select({ message: 'Stack', options: options(stacks), initialValue: 'elysia' as const }))
  const pm: PackageManager =
    stack === 'elysia'
      ? 'bun'
      : orExit(await p.select({ message: 'Package manager', options: options(packageManagers), initialValue: 'pnpm' as const }))
  const backend = orExit(await p.select({ message: 'Backend structure', options: options(backends) }))
  const authChoices = options(auths).filter((o) => o.value !== 'pocketbase' || stack === 'pocketbase')
  const auth: Auth[] = orExit(
    await p.multiselect({
      message: 'Auth',
      options: authChoices,
      initialValues: stack === 'pocketbase' ? ['pocketbase'] : ['google'],
      required: false,
    }),
  )

  p.log.step('Voice')
  const language = orExit(await p.select({ message: 'Languages', options: options(languages) }))
  const voice = orExit(
    await p.text({ message: 'Brand personality in three words?', placeholder: 'Playful, civic, everyday', validate: required }),
  )

  p.log.step('Setup')
  const defaultSkills: SkillSet[] =
    language === 'en' ? ['matt', 'impeccable', 'style'] : ['matt', 'impeccable', 'kienThai', 'style']
  const skills = orExit(
    await p.multiselect<SkillSet>({
      message: 'Install skills into the project',
      options: options(skillSets),
      initialValues: defaultSkills,
      required: false,
    }),
  )
  const git = orExit(await p.confirm({ message: 'git init?', initialValue: true }))

  return {
    dir,
    name: basename(dir),
    oneLiner,
    users,
    job,
    domains: domains
      ? domains
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean)
      : [],
    workflow,
    stack,
    pm,
    backend,
    auth,
    language,
    voice,
    skills,
    git,
  }
}
