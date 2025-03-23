import { path } from 'zx'
import type { Config } from '../types/configs.d.ts'

export default {
  name: 'clash-verge-rev-config.yaml',
  getFilePath({ home }) {
    return path.join(
      home,
      'Library/Application Support',
      'io.github.clash-verge-rev.clash-verge-rev',
      'verge.yaml',
    )
  },
} satisfies Config
