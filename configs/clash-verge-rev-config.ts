import { os, path } from 'zx'
import type { Config } from '../types/configs.d.ts'

export default {
  name: 'clash-verge-rev-config.yaml',
  getFilePath({ home }) {
    const folderLocations = [
      {
        name: 'darwin',
        value: path.join(
          home,
          'Library',
          'Application Support',
          'io.github.clash-verge-rev.clash-verge-rev',
          'verge.yaml',
        ),
      },
      {
        name: 'win32',
        value: path.join(
          home,
          'AppData',
          'Roaming',
          'io.github.clash-verge-rev.clash-verge-rev',
          'verge.yaml',
        ),
      },
      {
        name: 'linux',
        value: path.join(
          home,
          '.config',
          'io.github.clash-verge-rev.clash-verge-rev',
          'verge.yaml',
        ),
      },
    ]

    const platform = os.platform()
    const folderLocation = folderLocations.find(({ name }) => platform === name)
    if (!folderLocation) throw new Error(`Unsupported platform ${platform}`)

    return folderLocation.value
  },
} satisfies Config
