import { path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'npmrc',
  getFilePath: ({ home }) => path.join(home, '.npmrc'),
} satisfies Config
