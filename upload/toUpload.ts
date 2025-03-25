import { Octokit } from '@octokit/rest'
import { chalk, spinner } from 'zx'
import { writeGistId } from '../utils/writeGistId.ts'
import { writeGithubToken } from '../utils/writeGithubToken.ts'
import { retry as retryPlugin } from '@octokit/plugin-retry'
import { writeChecksums } from '../utils/writeChecksums.ts'

export async function toUpload(
  gistId: string,
  token: string,
  files: { name: string; content: string; path: string }[],
) {
  if (!files.length) {
    console.log('No file needs to be uploaded.')
    return
  }

  let gistIdValid = true
  let tokenValid = true
  let gistUrl: string | undefined

  const uploadedFiles = files.reduce((pre, cur) => {
    pre[cur.name] = { content: cur.content }
    return pre
  }, {} as Record<string, { content: string }>)

  try {
    const octokit = new (Octokit.plugin(retryPlugin))({
      auth: token,
      userAgent: 'updown',
    })

    console.log(`Upload ${files.length} files:`, files.map((v) => chalk.bold(v.name)).join(', '))

    await spinner(`Uploading...`, async () => {
      const rsp = await octokit.rest.gists.update({
        gist_id: gistId,
        files: uploadedFiles,
      }).catch((error) => {
        if (error.response.status === 404) {
          gistIdValid &&= false
        }

        if (error.response.status === 401) {
          tokenValid &&= false
        }

        throw new Error(
          `Failed to upload. HTTP status code: ${error.response.status}`,
        )
      })
      gistUrl = rsp.data.html_url
    })

    await writeChecksums(files)
    console.log(chalk.green('Uploaded successfully to the Gist!'))
    console.log('HTML URL:', gistUrl)
  } catch (error) {
    console.error(chalk.red('Error: Fail to upload.', error))
  }

  if (gistIdValid) {
    await writeGistId(gistId)
  } else {
    console.error(
      chalk.red('Error: Gist with id', `\`${gistId}\``, 'not found!'),
    )
    await writeGistId('')
  }
  if (tokenValid) {
    await writeGithubToken(token)
  } else {
    console.error(
      chalk.red(
        'Error: Invalid Github token (Make sure the gist write permission is granted)',
      ),
    )
    await writeGithubToken('')
  }
}
