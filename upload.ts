import { chalk, echo } from 'zx'
import configs from './configs/index.ts'
import { exit } from 'node:process'
import { readGistId } from './utils/readGistId.ts'
import { readGithubToken } from './utils/readGithubToken.ts'
import { validateConfigs } from './utils/validateConfigs.ts'
import { prepareUpload } from './upload/prepareUpload.ts'
import { toUpload } from './upload/toUpload.ts'

export async function upload() {
  try {
    const messages = validateConfigs(configs)
    if (messages.length) {
      echo(chalk.red('Error: Invalid configs.', messages.join('; ')))
      exit(1)
    }

    const gistId = await readGistId()
    const token = await readGithubToken()
    console.log()

    // Prepare for upload
    const files = await prepareUpload(configs)
    console.log()

    // Upload
    await toUpload(gistId, token, files)
    console.log()

    console.log('Done!')
  } catch (error) {
    console.log()
    echo(chalk.red('Error:', error))
    exit(1)
  }
}
