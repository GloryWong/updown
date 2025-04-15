import { Config } from '../types/configs.d.ts'
import { os, path, which } from 'zx'
import { spinnerExec } from '../utils/spinnerExec.ts'

export default {
  name: 'Brewfile',
  getFilePath: ({ tmp }) => path.join(tmp, 'Brewfile'),
  beforeUpload: async ({ filePath }) => {
    if (os.platform() === 'win32') {
      throw new Error(`Unsupported platform ${os.platform()}`)
    }

    const brew = await which('brew', { nothrow: true })
    if (brew === null) {
      await spinnerExec(
        'Homebrew is not installed. Installing...',
        'Failed to download or install Homebrew',
        'Homebrew installed successfully!',
        ($) =>
          $`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`,
      )
    }

    // Dump brewfile
    await spinnerExec(
      'Dumping Brewfile...',
      'Failed to dump Brewfile',
      `Brewfile successfully dumped at ${filePath}`,
      ($) => $`brew bundle dump --force --file=${filePath}`,
    )
  },
} satisfies Config
