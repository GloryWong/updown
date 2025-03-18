import { chalk, fs, os } from 'zx'
import { ROOT, TMP_PATH } from '../constants.ts'
import { Configs } from '../types/configs.d.ts'
import { verifyChecksum } from '../utils/verifyChecksum.ts'

async function validateFile(name: string, filePath: string) {
  const result: {
    valid: boolean
    message: string
    content: string
    warn: boolean
  } = { valid: false, message: '', content: '', warn: true }

  if (!(await fs.pathExists(filePath))) {
    result.message = name + ' does not exist.'
    return result
  }

  const content = await fs.readFile(filePath, 'utf-8')
  if (!content.trim()) {
    result.message = name + ' is empty.'
    return result
  }
  
  if (await verifyChecksum(name, filePath)) {
    result.message = name + ' has not changed.'
    result.warn = false
    return result
  }

  result.valid = true
  result.content = content

  return result
}

export async function prepareUpload(configs: Configs) {
  await fs.ensureDir(ROOT)
  await fs.ensureDir(TMP_PATH)
  const files: { name: string; content: string; path: string }[] = []
  const home = os.homedir()
  console.log('Prepare for upload:')
  console.log()

  for (const { name, getFilePath, beforeUpload } of configs) {
    try {
      console.log('[', chalk.bold(name), ']')

      const filePath = await getFilePath({ root: ROOT, home, tmp: TMP_PATH })

      if (beforeUpload) {
        await beforeUpload({ root: ROOT, home, tmp: TMP_PATH, filePath })
      }

      console.log('Local file path:', filePath)
      const { valid, message, content, warn } = await validateFile(
        name,
        filePath,
      )
      if (valid) {
        files.push({ name, content, path: filePath })
      } else {
        warn
          ? console.warn(chalk.yellow(message, 'Skip it!'))
          : console.log(message, 'Skip it!')
      }
    } catch (error) {
      console.error(
        chalk.red(
          'Error: Something went wrong when prepare for uploading',
          name,
          '. Skip it!',
          error,
        ),
      )
    }
    console.log()
  }

  return files
}
