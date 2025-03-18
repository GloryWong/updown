import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'vimrc',
  beforeUpload: () => path.join(os.homedir(), '.vimrc'),
} satisfies Config
