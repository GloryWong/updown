import { Configs } from '../types/configs.d.ts'

export function validateConfigs(configs: Configs) {
  const names = new Set<string>()
  const messages: string[] = []

  configs.forEach((v) => {
    if (names.has(v.name)) {
      messages.push(`Duplicate name '${v.name}'`)
    }
    names.add(v.name)
  })

  return messages
}
