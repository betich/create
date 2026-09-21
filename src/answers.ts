export const stacks = {
  elysia: 'Elysia + Drizzle, end-to-end types (default)',
  cloudflare: 'Cloudflare Workers + D1 + R2 + Pages (cheap)',
  pocketbase: 'PocketBase, one Go binary (self-hosted)',
} as const

export const packageManagers = { bun: 'bun', pnpm: 'pnpm', npm: 'npm' } as const

export const backends = {
  simple: 'Simple: routes/, lib/, db/',
  module: 'Module / service / controller',
  ddd: 'Domain-driven: domain/, app/, infra/',
} as const

export const auths = {
  google: 'Google',
  line: 'LINE Login',
  pocketbase: 'PocketBase auth',
  undecided: 'Decide later',
} as const

export const workflows = {
  issues: 'Issue-driven: GitHub Issues, one PR per ticket',
  spec: 'Spec-driven: SPEC.md + docs/specs/, cited by id',
} as const

export const languages = {
  'th-en': 'Thai first, English toggle',
  th: 'Thai only',
  en: 'English only',
} as const

export const skillSets = {
  matt: { label: 'mattpocock/skills (grilling, specs, tdd, review)', source: 'mattpocock/skills' },
  impeccable: { label: 'impeccable (design)', source: 'pbakaus/impeccable' },
  kienThai: { label: 'kien-thai (natural Thai prose)', source: 'chakrit/kien-thai' },
  style: { label: 'betich/style (kickoff, domain-experts, thai-ux-copy)', source: 'betich/style' },
} as const

export type Stack = keyof typeof stacks
export type PackageManager = keyof typeof packageManagers
export type Backend = keyof typeof backends
export type Auth = keyof typeof auths
export type Workflow = keyof typeof workflows
export type Language = keyof typeof languages
export type SkillSet = keyof typeof skillSets

export interface Answers {
  dir: string
  name: string
  oneLiner: string
  users: string
  job: string
  domains: string[]
  workflow: Workflow
  stack: Stack
  pm: PackageManager
  backend: Backend
  auth: Auth[]
  language: Language
  voice: string
  skills: SkillSet[]
  git: boolean
}
