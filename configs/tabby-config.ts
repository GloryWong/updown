import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'tabby-config.yaml',
  getFilePath: function({ home }) {
    const configFile = 'config.yaml'
    const fileLocations = [
      {
        name: 'darwin',
        value: path.join(home, 'Library/Application Support/tabby', configFile),
      },
      { name: 'win32', value: path.join(home, 'AppData/Tabby', configFile) },
      { name: 'linux', value: path.join(home, '.config/tabby', configFile) },
    ]

    const platform = os.platform()
    const fileLocation = fileLocations.find(({ name }) => platform === name)
    if (!fileLocation) throw new Error(`Unsupported platform ${platform}`)

    return fileLocation.value
  },
} satisfies Config
