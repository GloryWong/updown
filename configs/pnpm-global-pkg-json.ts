import { $, path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'pnpm-global-pkg-json',
  getFilePath: async () => {
    const { stdout, ok, message } = await $({ nothrow: true })`pnpm root -g`
    if (!ok) {
      throw new Error(`Failed to get pnpm root. ${message}`)
    }

    return path.resolve(stdout, '..', 'package.json')
  },
} satisfies Config
