import { fs } from 'zx'
import { CHECKSUMS_FILE } from '../constants.ts'
import { generateChecksum } from './generateChecksum.ts'
import { readChecksums } from './readChecksums.ts'

export async function writeChecksums(
  filePaths: { name: string; path: string }[],
) {
  try {
    await fs.ensureFile(CHECKSUMS_FILE)
    const checksums = await readChecksums()
    for (const { name, path } of filePaths) {
      if (await fs.pathExists(path)) {
        const checksum = await generateChecksum(path)
        checksums[name] = checksum
      }
    }
    fs.writeJson(CHECKSUMS_FILE, checksums)
  } catch {
    //
  }
}
