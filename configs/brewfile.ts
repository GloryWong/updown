import { Config } from '../types/configs.d.ts'
import { $, fs, path, spinner, which } from 'zx'

export default {
  name: 'Brewfile',
  beforeUpload: async ({ root }) => {
    const brew = await which('brew', { nothrow: true })
    if (brew === null) {
      const { ok, stderr } = await spinner(
        'Homebrew is not installed. Installing...',
        () =>
          $({
            nothrow: true,
          })`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`,
      )
      if (!ok) {
        throw new Error(`Failed to download or install Homebrew. ${stderr}`)
      }
      console.log('Homebrew installed successfully!')
    }

    await fs.ensureDir(root)
    const filePath = path.join(root, 'Brewfile')

    // Dump brewfile
    const output = await spinner(
      'Dumping Brewfile...',
      () => $({ nothrow: true })`brew bundle dump --force --file=${filePath}`,
    )
    if (!output.ok) {
      throw new Error('Failed to dump Brewfile.')
    }
    console.log(`Brewfile successfully dumped at ${filePath}`)

    return filePath
  },
} satisfies Config
