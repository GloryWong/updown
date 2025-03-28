import { Config } from '../types/configs.d.ts'
import { $, fs, path } from 'zx'
import { spinnerExec } from '../utils/spinnerExec.ts'

export default {
  name: 'nvim.tar.gz',
  getFilePath: ({ tmp }) => path.join(tmp, 'nvm-config.tar.gz'),
  beforeUpload: async ({ home, filePath }) => {
    const NVM_CONFIG_DIR = path.join(home, '.config/nvim')

    if (!(await fs.pathExists(NVM_CONFIG_DIR))) {
      throw new Error(`${NVM_CONFIG_DIR} does not exist`)
    }

    await spinnerExec(
      'Archiving NeoVim config...',
      'Failed to archive NeoVim config',
      'NeoVim config archived successfully.',
      ($) =>
        $({
          cwd: NVM_CONFIG_DIR
        })`tar --exclude-vcs -cf - . | gzip -nc > ${filePath}`,
    )
  },
} satisfies Config
