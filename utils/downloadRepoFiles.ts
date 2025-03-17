import { fs, path } from 'zx'
import { Buffer } from 'node:buffer'
import { octokit } from './octokit.ts'

interface Options {
  dir: string
  branch: string
}

export async function downloadRepoFiles(
  owner: string,
  repo: string,
  filePath: string,
  options?: Options,
) {
  const { dir = '.', branch = 'master' } = options ?? {}
  try {
    // Fetch metadata for file or folder
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch,
    })

    if (Array.isArray(data)) {
      // If it's an array, it's a directory -> Recursively download all files
      const folderPath = path.join(dir, filePath)
      await fs.ensureDir(folderPath)

      for (const file of data) {
        await downloadRepoFiles(owner, repo, file.path, options)
      }
    } else if (data.type === 'file') {
      // If it's a single file, download and save it
      if (data.encoding === 'base64') {
        const content = Buffer.from(data.content, 'base64').toString('utf-8')

        const localFilePath = path.join(dir, data.path)
        await fs.mkdir(path.dirname(localFilePath), { recursive: true }) // Ensure parent directories exist

        await fs.writeFile(localFilePath, content)
        console.log(`Downloaded: ${data.path}`)
      }
    }
  } catch (error) {
    console.error(`Error downloading ${filePath}:`, error)
  }
}
