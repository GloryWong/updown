import { chalk } from 'zx'
import configs from './configs/index.ts'
import { readGistId } from './utils/readGistId.ts'
import { readGithubToken } from './utils/readGithubToken.ts'
import { validateConfigs } from './utils/validateConfigs.ts'
import { prepareUpload } from './upload/prepareUpload.ts'
import { toUpload } from './upload/toUpload.ts'
import logger from './utils/logger.ts'

export async function upload() {
  try {
    const messages = validateConfigs(configs)
    if (messages.length) {
      logger.error(chalk.red('Error: Invalid configs.', messages.join('; ')))
      Deno.exit(1)
    }

    const gistId = await readGistId()
    const token = await readGithubToken()
    logger.log()

    // Prepare for upload
    const files = await prepareUpload(configs)

    // Upload
    await toUpload(gistId, token, files)
    logger.log()

    logger.log('Done!')
  } catch (error) {
    logger.log()
    logger.error(chalk.red('Error:', error))
    Deno.exit(1)
  }
}
