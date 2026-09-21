const placeholder = /\{\{([A-Z_]+)\}\}/g

export type Vars = Record<string, string>

export function render(template: string, vars: Vars): string {
  const missing = new Set<string>()
  const out = template.replace(placeholder, (_, key: string) => {
    const value = vars[key]
    if (value === undefined) missing.add(key)
    return value ?? ''
  })
  if (missing.size) throw new Error(`template needs ${[...missing].join(', ')}`)
  return out
}
