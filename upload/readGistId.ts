import { fs, question } from 'zx'
import { GIST_ID_FILE } from '../constants.ts'
import { confirm } from '../utils/confirm.ts'

export async function readGistId() {
  await fs.ensureFile(GIST_ID_FILE)
  let gistId: string | null = (await fs.readFile(GIST_ID_FILE, 'utf-8'))
    .trim()
  if (gistId) {
    console.log('Found existing Gist id', gistId)
    if (!(await confirm('Do you want to use it?', 'yes'))) {
      gistId = null
    }
  }
  while (!gistId) {
    gistId = await question(
      'Enter the Gist id where you want to upload your files: ',
    )
  }

  return gistId
}
