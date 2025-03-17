import { os, path } from 'zx'

export const ROOT = path.join(os.homedir(), '.updown')
export const GIST_ID_FILE = path.join(ROOT, 'gist_id')
export const GITHUB_TOKEN_FILE = path.join(ROOT, 'github_token')
