#!/usr/bin/env zx

import { chalk, echo, fs, spinner, os } from 'zx'
import configs from './configs/index.ts'
import { GIST_ID_FILE, GITHUB_TOKEN_FILE, ROOT } from './constants.ts'
import { Octokit } from '@octokit/rest'
import { retry as retryPlugin } from '@octokit/plugin-retry'
import { exit } from 'node:process'
import { readGistId } from './upload/readGistId.ts'
import { readGithubToken } from './upload/readGithubToken.ts'
import { validateConfigs } from './utils/validateConfigs.ts'
import { writeGistId } from './upload/writeGistId.ts'
import { writeGithubToken } from './upload/writeGithubToken.ts'

export async function upload() {
  try {
    const messages = validateConfigs(configs)
    if (messages.length) {
      echo(chalk.red('Error: Invalid configs.', messages.join('; ')))
      exit(1)
    }

    const gistId = await readGistId()
    const token = await readGithubToken()

    const octokit = new (Octokit.plugin(retryPlugin))({
      auth: token,
      userAgent: 'updown',
    })

    await fs.ensureDir(ROOT)
    const home = os.homedir()

    // Prepare for upload
    const files: {name: string, content: string}[] = []
    console.log()
    console.log('Prepare for upload:')
    console.log()
    for (const { name, getFilePath, beforeUpload } of configs) {
      try {
        console.log('[', chalk.bold(name), ']')
        const filePath = await getFilePath({ root: ROOT, home })
        if (beforeUpload) {
          await beforeUpload({ root: ROOT, home, filePath })
        }
        const content = await fs.readFile(filePath, 'utf-8')
        files.push({ name, content })
        console.log('File local path:', filePath)
      } catch (error) {
        console.error(
          chalk.red(
            'Error: Something went wrong prepare for uploading',
            name,
            '.',
            'It won\'t be uploaded.',
            error,
          ),
        )
      }
    }
    console.log()

    // Upload
    let gistIdValid = true
    let tokenValid = true
    const uploadedFiles = files.reduce((pre, cur) => {
      pre[cur.name] = { content: cur.content }
      return pre
    }, {} as Record<string, { content: string }>)
    try {
      console.log('Upload:', files.map(v => v.name).join(', '))
      let gistUrl

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

      console.log(chalk.green('Uploaded successfully to the Gist!'))
      console.log('HTML URL:', gistUrl)
    } catch (error) {
      console.error(chalk.red('Error: Fail to upload.', error))
    }

    await fs.writeFile(GIST_ID_FILE, gistIdValid ? gistId : '')
    await fs.writeFile(GITHUB_TOKEN_FILE, tokenValid ? token : '')

    if (gistIdValid) {
      writeGistId(gistId)
    } else {
      console.error(chalk.red('Error: Gist with id', `\`${gistId}\``, 'not found!'))
      writeGistId('')
    }
    if (tokenValid) {
      writeGithubToken(token)
    } else {
      console.error(
        chalk.red(
          'Error: Invalid Github token (Make sure the gist write permission is granted)',
        ),
      )
      writeGithubToken('')
    }
    console.log()
    console.log('Done!')
  } catch (error) {
    console.log()
    echo(chalk.red('Error:', error))
    exit(1)
  }
}
