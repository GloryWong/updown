import { Octokit } from '@octokit/rest'
import { chalk, spinner } from 'zx'
import { writeGistId } from '../utils/writeGistId.ts'
import { writeGithubToken } from '../utils/writeGithubToken.ts'
import { retry as retryPlugin } from '@octokit/plugin-retry'
import { writeChecksums } from '../utils/writeChecksums.ts'
import logger from '../utils/logger.ts'
import { getEnv } from '../utils/envs.ts'

export async function toUpload(
  gistId: string,
  token: string,
  files: { name: string; content: string; path: string }[],
) {
  if (!files.length) {
    logger.log('No file needs to be uploaded.')
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

    logger.log(
      `Ready to upload ${files.length} files:`,
      files.map((v) => chalk.bold(v.name)).join(', '),
    )

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
    getEnv('UPDOWN_QUIET') &&
      logger.logKeep(
        `Uploaded ${files.length} files:`,
        files.map((v) => chalk.bold(v.name)).join(', '),
      )
    logger.log(chalk.green('Uploaded successfully to the Gist!'))
    logger.log('HTML URL:', gistUrl)
  } catch (error) {
    logger.error(chalk.red('Error: Fail to upload.', error))
  }

  if (!gistIdValid) {
    logger.error(
      chalk.red('Error: Gist with id', `\`${gistId}\``, 'not found!'),
    )
    await writeGistId('')
  }
  if (!tokenValid) {
    logger.error(
      chalk.red(
        'Error: Invalid Github token (Make sure the gist write permission is granted)',
      ),
    )
    await writeGithubToken('')
  }
}
