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

// Only the keys the chosen parts can fill. `render` throws if a template needs one that's missing.
export function toVars(a: Answers, stackSummary: string | undefined): Vars {
  const vars: Vars = { NAME: a.name }
  if (a.stack) {
    Object.assign(vars, { STACK: a.stack.stack, STACK_SUMMARY: stackSummary ?? '', PM: a.stack.pm })
  }
  const b = a.brief
  if (b) {
    Object.assign(vars, {
      ONE_LINER: b.oneLiner,
      USERS: b.users,
      JOB: b.job,
      DOMAINS: b.domains.length ? b.domains.map((d) => `- ${d}`).join('\n') : '_Not clear yet. `/kickoff` asks._',
      BACKEND: backends[b.backend],
      AUTH: b.auth.map((x) => auths[x]).join(', ') || auths.undecided,
      WORKFLOW: workflowText[b.workflow],
      WORKFLOW_SHORT: b.workflow,
      LANGUAGES: `${languages[b.language]}. ${voiceHint[b.language]}`,
      VOICE: b.voice,
    })
  }
  return vars
}
