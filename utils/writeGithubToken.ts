import { fs } from 'zx'
import { GITHUB_TOKEN_FILE } from '../constants.ts'

export function writeGithubToken(id: string) {
  return fs.writeFile(GITHUB_TOKEN_FILE, id)
}
