import { $, fs, path, spinner } from 'zx'
import { Config } from '../types/configs.d.ts'

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

    const { ok, stderr } = await spinner(
      `Compressing ${FILE_NAME}...`,
      () => $({ nothrow: true })`gzip -nc ${RAW_FILE_PATH} > ${filePath}`,
    )

    if (!ok) {
      throw new Error(`Failed to compress ${FILE_NAME}. ${stderr}`)
    }

    console.log(`${FILE_NAME} compressed successfully.`)
  },
} satisfies Config
