import { path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'gitconfig',
  getFilePath: ({ home }) => path.join(home, '.gitconfig'),
} satisfies Config
