import { path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'Raycast.rayconfig',
  getFilePath: ({ tmp }) => path.join(tmp, 'Raycast.rayconfig'),
} satisfies Config
