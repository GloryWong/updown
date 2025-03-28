import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { spinnerExec } from '../utils/spinnerExec.ts'

export default {
  name: 'vscode-settings.tar.gz',
  getFilePath: ({ tmp }) => path.join(tmp, 'vscode.tar.gz'),
  beforeUpload: async ({ home, filePath }) => {
    const vsCodeUserDirs = [
      {
        name: 'darwin',
        value: path.join(home, 'Library/Application Support/Code/User'),
      },
      { name: 'win32', value: path.join(home, 'AppData/Code/User') },
      { name: 'linux', value: path.join(home, '.config/Code/User') },
    ]
    const platform = os.platform()
    const vsCodeUserDir = vsCodeUserDirs.find(({ name }) => platform === name)
    if (!vsCodeUserDir) throw new Error(`Unsupported platform ${platform}`)

    const settingFiles = ['settings.json', 'keybindings.json', 'tasks.json']
    await spinnerExec(
      'Archiving setting files...',
      'Failed to archive',
      'VSCode settings archived successfully.',
      ($) =>
        $({
          cwd: vsCodeUserDir.value,
        })`tar -cf - ${settingFiles} | gzip -nc > ${filePath}`,
    )
  },
} satisfies Config
