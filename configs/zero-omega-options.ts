import { fs, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { spinnerExec } from '../utils/spinnerExec.ts'

const FILE_NAME = 'ZeroOmegaOptions.bak'
const FILE_NAME_GZ = `${FILE_NAME}.gz`

export default {
  name: FILE_NAME_GZ,
  getFilePath: ({ tmp }) => path.join(tmp, FILE_NAME_GZ),
  beforeUpload: async ({ tmp, filePath }) => {
    const RAW_FILE_PATH = path.join(tmp, FILE_NAME)
    if (!(await fs.pathExists(RAW_FILE_PATH))) {
      throw new Error(`${RAW_FILE_PATH} does not exist`)
    }

    await spinnerExec(
      `Compressing ${FILE_NAME}...`,
      `Failed to compress ${FILE_NAME}`,
      `${FILE_NAME} compressed successfully.`,
      ($) => $`gzip -nc ${RAW_FILE_PATH} > ${filePath}`,
    )
  },
} satisfies Config
