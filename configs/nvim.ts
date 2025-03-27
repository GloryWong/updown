import { Config } from '../types/configs.d.ts'
import { $, fs, path, spinner } from 'zx'

export default {
  name: 'nvim.tar.gz',
  getFilePath: ({ tmp }) => path.join(tmp, 'nvm-config.tar.gz'),
  beforeUpload: async ({ home, filePath }) => {
    const NVM_CONFIG_DIR = path.join(home, '.config/nvim')

    if (!(await fs.pathExists(NVM_CONFIG_DIR))) {
      throw new Error(`${NVM_CONFIG_DIR} does not exist`)
    }

    const { ok, message } = await spinner(
      'Archiving NeoVim config...',
      () =>
        $({
          nothrow: true,
          cwd: NVM_CONFIG_DIR
        })`tar --exclude-vcs -cf - . | gzip -nc > ${filePath}`,
    )
    if (!ok) {
      throw new Error(`Failed to archive NeoVim config. ${message}`)
    }

    console.log(`NeoVim config archived successfully.`)
  },
} satisfies Config
