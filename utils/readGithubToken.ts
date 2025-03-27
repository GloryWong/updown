import { fs } from 'zx'
import { GITHUB_TOKEN_FILE } from '../constants.ts'
import { askHiddenInput } from './askHiddenInput.ts'
import { getEnv } from './envs.ts'

export async function readGithubToken() {
  await fs.ensureFile(GITHUB_TOKEN_FILE)
  let token: string = (await fs.readFile(GITHUB_TOKEN_FILE, 'utf-8'))
    .trim()

  if (getEnv('UPDOWN_INTERACTIVE')) {
    while (!token) {
      token = await askHiddenInput('Enter your GitHub personal access token: ')
    }
  
    return token
  }
  
  if (token)
    return token
  else
    throw new Error('GitHub Token not found. You must set the token by enabling \
interaction mode using the option --interactive')
}
