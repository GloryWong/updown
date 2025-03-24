import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'pnpm-global-pkg-json',
  getFilePath: ({ home }) => {
    const configFile = 'package.json'
    const fileLocations = [
      {
        name: 'darwin',
        value: path.join(home, 'Library/pnpm/global', '5', configFile),
      },
      {
        name: 'win32',
        value: path.join(home, 'AppData/Local/pnpm/global', '5', configFile),
      },
      {
        name: 'linux',
        value: path.join(home, '.local/share/pnpm/global', '5', configFile),
      },
    ]

    const platform = os.platform()
    const fileLocation = fileLocations.find(({ name }) => platform === name)
    if (!fileLocation) throw new Error(`Unsupported platform ${platform}`)

    return fileLocation.value
  },
} satisfies Config
