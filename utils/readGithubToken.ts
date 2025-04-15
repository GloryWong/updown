import { fs } from 'zx'
import { GITHUB_TOKEN_FILE } from '../constants.ts'
import { askHiddenInput } from './askHiddenInput.ts'
import { getEnv } from './envs.ts'
import { writeGithubToken } from './writeGithubToken.ts'

export async function readGithubToken() {
  await fs.ensureFile(GITHUB_TOKEN_FILE)
  let token = (await fs.readFile(GITHUB_TOKEN_FILE, 'utf-8'))
    .trim()

  if (getEnv('UPDOWN_INTERACTIVE')) {
    if (getEnv('UPDOWN_RESET_TOKEN')) {
      token = ''
    }

    while (!token) {
      token = await askHiddenInput('Enter your GitHub personal access token: ')
    }

    await writeGithubToken(token)
    return token
  }

  if (token) {
    return token
  } else {
    throw new Error(
      'Fatal error: GitHub Token not found. You must set the token by enabling \
interaction mode using the option --interactive',
    )
  }
}
