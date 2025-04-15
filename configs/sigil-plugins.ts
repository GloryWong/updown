import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { spinnerExec } from '../utils/spinnerExec.ts'

export default {
  name: 'sigil-plugins.tar.gz',
  getFilePath: ({ tmp }) => path.join(tmp, 'sigil-plugins.tar.gz'),
  async beforeUpload({ home, filePath }) {
    const folderLocations = [
      {
        name: 'darwin',
        value: path.join(
          home,
          'Library',
          'Application Support',
          'sigil-ebook',
          'sigil',
        ),
      },
      {
        name: 'win32',
        value: path.join(home, 'AppData', 'Roaming', 'sigil-ebook', 'sigil'),
      },
      {
        name: 'linux',
        value: path.join(home, '.config', 'sigil-ebook', 'sigil'),
      },
    ]

    const platform = os.platform()
    const folderLocation = folderLocations.find(({ name }) => platform === name)
    if (!folderLocation) throw new Error(`Unsupported platform ${platform}`)

    const files = ['plugins', 'plugins_prefs', 'README.md']
    await spinnerExec(
      'Archiving plugins and plugins preferences...',
      'Failed to archive',
      'Sigil plugins archived successfully.',
      ($) =>
        $({
          cwd: folderLocation.value,
        })`tar -cf - ${files} | gzip -nc > ${filePath}`,
    )
  },
} satisfies Config
