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

    const { ok, stderr } = await spinner(
      'Archiving NeoVim config...',
      () =>
        $({
          nothrow: true,
        })`tar --exclude-vcs -c ${NVM_CONFIG_DIR} | gzip -n > ${filePath}`,
    )
    if (!ok) {
      throw new Error(`Failed to archive NeoVim config. ${stderr}`)
    }

    console.log(`NeoVim config archived successfully.`)
  },
} satisfies Config
