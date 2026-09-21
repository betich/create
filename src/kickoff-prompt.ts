import { stacks, workflows, type Answers } from './answers.js'

export function kickoffPrompt(a: Answers): string {
  const b = a.brief
  if (!b) {
    return [
      `/kickoff`,
      ``,
      `${a.name} already exists. Read AGENTS.md, docs/ and the code before asking anything, and skip every step whose output is already there.`,
      `Grill me only where the docs are thin, and keep it short.`,
    ].join('\n')
  }

  const domains = b.domains.length
    ? `The domains I see so far: ${b.domains.join(', ')}.`
    : 'I have not split it into domains yet.'
  const firstMove =
    b.workflow === 'issues'
      ? 'Finish by splitting the first slice into GitHub issues with to-tickets.'
      : 'Finish by writing the first spec into docs/specs/ with to-spec.'
  const stack = a.stack ? `${stacks[a.stack.stack]}, ${a.stack.pm}, ` : ''

  return [
    `/kickoff`,
    ``,
    `We are building ${a.name}: ${b.oneLiner}`,
    `It is for ${b.users}. The job it does for them: ${b.job}`,
    domains,
    ``,
    `Already decided (docs/brief.md): ${stack}${workflows[b.workflow].split(':')[0]?.toLowerCase()}.`,
    `Don't re-ask anything in docs/brief.md. Grill me only where the brief is thin, and keep it short.`,
    firstMove,
  ].join('\n')
}
