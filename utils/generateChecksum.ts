import { fs } from 'zx'

export async function generateChecksum(filePath: string) {
  if (!(await fs.pathExists(filePath))) {
    return ''
  }

  const content = await Deno.readFile(filePath)
  const hashBuffer = await crypto.subtle.digest('SHA-256', content)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  return hashHex
}
