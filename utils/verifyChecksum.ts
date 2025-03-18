import { generateChecksum } from './generateChecksum.ts'
import { readChecksums } from './readChecksums.ts'

export async function verifyChecksum(name: string, filePath: string) {
  const checksums = await readChecksums()
  const checksum = await generateChecksum(filePath)
  return checksum === checksums[name]
}
