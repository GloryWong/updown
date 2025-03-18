import { fs } from 'zx'
import { GIST_ID_FILE } from '../constants.ts'

export function writeGistId(id: string) {
  return fs.writeFile(GIST_ID_FILE, id)
}
