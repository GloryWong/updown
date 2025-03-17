import { question } from 'zx'

export async function confirm(text: string, defaultValue: 'yes' | 'no' = 'no') {
  const hint = defaultValue === 'yes' ? 'Y/n' : 'y/N'
  let answer = (await question(`${text} [${hint}] `)).toLocaleLowerCase() ||
    defaultValue

  if (['y', 'yes'].includes(answer)) return true
  if (['n', 'no'].includes(answer)) return false

  return confirm(text, defaultValue)
}
