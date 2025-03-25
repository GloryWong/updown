import { ENV_SCHEME } from '../constants.ts'

type EnvScheme = typeof ENV_SCHEME

type Env = {
  [K in keyof EnvScheme]: ReturnType<EnvScheme[K]>
}

export function getEnv<K extends keyof Env>(
  key: K,
): Env[K] | undefined {
  const value = Deno.env.get(key)
  if (!value) return

  return ENV_SCHEME[key](value)
}

export function setEnv<K extends keyof Env>(
  key: K,
  value: Env[K],
) {
  return Deno.env.set(key, String(value))
}
