import { chalk } from 'zx'
import configs from './configs/index.ts'
import { readGistId } from './utils/readGistId.ts'
import { readGithubToken } from './utils/readGithubToken.ts'
import { validateConfigs } from './utils/validateConfigs.ts'
import { prepareUpload } from './upload/prepareUpload.ts'
import { toUpload } from './upload/toUpload.ts'

export async function upload() {
  try {
    const messages = validateConfigs(configs)
    if (messages.length) {
      console.error(chalk.red('Error: Invalid configs.', messages.join('; ')))
      Deno.exit(1)
    }

    const gistId = await readGistId()
    const token = await readGithubToken()
    console.log()

    // Prepare for upload
    const files = await prepareUpload(configs)

    // Upload
    await toUpload(gistId, token, files)
    console.log()

    console.log('Done!')
  } catch (error) {
    console.log()
    console.error(chalk.red('Error:', error))
    Deno.exit(1)
  }
}
