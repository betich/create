import { stacks, workflows, type Answers } from './answers.js'

export function kickoffPrompt(a: Answers): string {
  const domains = a.domains.length
    ? `The domains I see so far: ${a.domains.join(', ')}.`
    : 'I have not split it into domains yet.'
  const firstMove =
    a.workflow === 'issues'
      ? 'Finish by splitting the first slice into GitHub issues with to-tickets.'
      : 'Finish by writing the first spec into docs/specs/ with to-spec.'

  return [
    `/kickoff`,
    ``,
    `We are building ${a.name}: ${a.oneLiner}`,
    `It is for ${a.users}. The job it does for them: ${a.job}`,
    domains,
    ``,
    `Already decided (docs/brief.md): ${stacks[a.stack]}, ${a.pm}, ${workflows[a.workflow].split(':')[0]?.toLowerCase()}.`,
    `Don't re-ask anything in docs/brief.md. Grill me only where the brief is thin, and keep it short.`,
    firstMove,
  ].join('\n')
}
