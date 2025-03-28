import { fs, question } from 'zx'
import { GIST_ID_FILE } from '../constants.ts'
import { confirm } from './confirm.ts'
import { getEnv } from './envs.ts'
import { writeGistId } from './writeGistId.ts'
import logger from './logger.ts'

export async function readGistId() {
  const envGistId = getEnv('UPDOWN_GIST_ID')
  if (envGistId) {
    await writeGistId(envGistId)
    return envGistId
  }

  await fs.ensureFile(GIST_ID_FILE)
  let gistId: string | null = (await fs.readFile(GIST_ID_FILE, 'utf-8'))
    .trim()
  
  if (getEnv('UPDOWN_INTERACTIVE')) {
    if (gistId) {
      logger.log('Found existing Gist Id', gistId)
      if (!(await confirm('Do you want to use it?', 'yes'))) {
        gistId = null
      }
    }
    while (!gistId) {
      gistId = await question(
        'Enter the Gist id where you want to upload your files: ',
      )
    }
  
    await writeGistId(gistId)
    return gistId
  }

  if (gistId)
    return gistId
  else
    throw new Error('Gist id not found. You can set gist id by either \
using the option --gist-id or enabling interaction mode using the option --interactive')
}
