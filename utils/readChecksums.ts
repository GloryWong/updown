import { fs } from 'zx'
import { CHECKSUMS_FILE } from '../constants.ts'
import { Checksums } from '../types/configs.d.ts'

export async function readChecksums() {
  await fs.ensureFile(CHECKSUMS_FILE)
  let checksums: Checksums
  try {
    checksums = await fs.readJson(CHECKSUMS_FILE)
  } catch {
    checksums = {}
  }
  return checksums
}
