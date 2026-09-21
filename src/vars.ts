import { auths, backends, languages, type Answers } from './answers.js'
import type { Vars } from './render.js'

const workflowText = {
  issues:
    'Issue-driven. Work is tracked in GitHub Issues: a parent issue holds the spec, tickets sit under it, and each ticket gets one branch and one PR.',
  spec: 'Spec-driven. `SPEC.md` indexes `docs/specs/<group>/`, specs are cited by id, and a spec is updated before the behaviour changes.',
} as const

const voiceHint = {
  'th-en': 'Thai is written first and English second, and each reads natively on its own. Neither is translated from the other.',
  th: 'Thai only.',
  en: 'English only. The `thai-ux-copy` rules on CTAs, status and errors still apply.',
} as const

export function toVars(a: Answers, stackSummary: string): Vars {
  return {
    NAME: a.name,
    ONE_LINER: a.oneLiner,
    USERS: a.users,
    JOB: a.job,
    DOMAINS: a.domains.length ? a.domains.map((d) => `- ${d}`).join('\n') : '_Not clear yet. `/kickoff` asks._',
    STACK: a.stack,
    STACK_SUMMARY: stackSummary,
    PM: a.pm,
    BACKEND: backends[a.backend],
    AUTH: a.auth.map((x) => auths[x]).join(', ') || auths.undecided,
    WORKFLOW: workflowText[a.workflow],
    WORKFLOW_SHORT: a.workflow,
    LANGUAGES: `${languages[a.language]}. ${voiceHint[a.language]}`,
    VOICE: a.voice,
  }
}
