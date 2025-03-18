import { path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'zshrc',
  getFilePath: ({ home }) => path.join(home, '.zshrc'),
} satisfies Config
