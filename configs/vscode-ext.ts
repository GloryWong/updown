import { $, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { spinnerExec } from '../utils/spinnerExec.ts'

export default {
  name: 'vscode-ext',
  getFilePath: ({ tmp }) => path.join(tmp, 'vscode-ext'),
  beforeUpload: async ({ filePath }) => {
    await spinnerExec(
      'Dumping extensions...',
      'Failed to dump extensions',
      `Dumped to ${filePath}`,
      () =>
        $`code --list-extensions | xargs -L 1 echo code --install-extension > ${filePath}`,
    )
  },
} satisfies Config
