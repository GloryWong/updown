import { fs } from 'zx'
import { GITHUB_TOKEN_FILE } from '../constants.ts'
import { askHiddenInput } from './askHiddenInput.ts'

export async function readGithubToken() {
  await fs.ensureFile(GITHUB_TOKEN_FILE)
  let token: string = (await fs.readFile(GITHUB_TOKEN_FILE, 'utf-8'))
    .trim()
  while (!token) {
    token = await askHiddenInput('Enter your GitHub personal access token: ')
  }

  return token
}
