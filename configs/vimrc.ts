import { path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'vimrc',
  getFilePath: ({ home }) => path.join(home, '.vimrc'),
} satisfies Config
