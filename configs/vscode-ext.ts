import { $, path, spinner } from 'zx'
import { Config } from '../types/configs.d.ts'

export default {
  name: 'vscode-ext',
  getFilePath: ({ tmp }) => path.join(tmp, 'vscode-ext'),
  beforeUpload: async ({ filePath }) => {
    const { ok, message } = await spinner(
      'Dump extensions...',
      () =>
        $({
          nothrow: true,
        })`code --list-extensions | xargs -L 1 echo code --install-extension > ${filePath}`,
    )
    if (!ok) {
      throw new Error(`Failed to dump extensions. ${message}`)
    }
    console.log('Dumped to', filePath)
  },
} satisfies Config
