import { $, os, path, spinner } from 'zx'
import { Config } from '../types/configs.d.ts'

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
    const output = await spinner(
      'Archiving setting files...',
      () =>
        $({
          nothrow: true,
          cwd: vsCodeUserDir.value,
        })`tar -cf - ${settingFiles} | gzip -nc > ${filePath}`,
    )
    if (!output.ok) {
      throw new Error(`Failed to archive. ${output.message}`)
    }

    console.log('vscode settings archived successfully.')
  },
} satisfies Config
