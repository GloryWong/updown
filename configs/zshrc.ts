import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'zshrc',
  beforeUpload: () => path.join(os.homedir(), '.zshrc'),
} satisfies Config
