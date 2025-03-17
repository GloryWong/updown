#!/usr/bin/env zx

import { chalk, echo, fs, question, spinner } from 'zx'
import configs from './configs/index.ts'
import { GIST_ID_FILE, GITHUB_TOKEN_FILE, ROOT } from './constants.ts'
import { confirm } from './utils/confirm.ts'
import { Octokit } from '@octokit/rest'
import { retry as retryPlugin } from '@octokit/plugin-retry'
import { exit } from 'node:process'
import { askHiddenInput } from './utils/askHiddenInput.ts'

export async function upload() {
  try {
    // Enter gist id
    await fs.ensureFile(GIST_ID_FILE)
    let gistId: string | null = (await fs.readFile(GIST_ID_FILE, 'utf-8'))
      .trim()
    if (gistId) {
      console.log('Found existing Gist id', gistId)
      if (!(await confirm('Do you want to use it?', 'yes'))) {
        gistId = null
      }
    }
    while (!gistId) {
      gistId = await question(
        'Enter the Gist id where you want to upload your files: ',
      )
    }

    // Enter github token
    await fs.ensureFile(GITHUB_TOKEN_FILE)
    let token: string | null = (await fs.readFile(GITHUB_TOKEN_FILE, 'utf-8'))
      .trim()
    while (!token) {
      token = await askHiddenInput('Enter your GitHub personal access token: ')
    }

    const octokit = new (Octokit.plugin(retryPlugin))({
      auth: token,
      userAgent: 'updown',
    })

    // Execute upload
    let gistIdValid = true
    let tokenValid = true
    for (const { name, beforeUpload } of configs) {
      try {
        console.log()
        console.log(chalk.blue('[', name, ']'))
        const filePath = await beforeUpload({ root: ROOT })
        const content = await fs.readFile(filePath, 'utf-8')
        await spinner(`Uploading ${name} ...`, async () => {
          await octokit.rest.gists.update({
            gist_id: gistId,
            files: {
              [name]: {
                content,
              },
            },
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

          console.log(chalk.green(name, 'uploaded successfully to the Gist!'))
        })
      } catch (error) {
        echo(
          chalk.red(
            'Error: Something went wrong when uploading',
            name,
            '.',
            error,
          ),
        )
      }
    }

    await fs.writeFile(GIST_ID_FILE, gistIdValid ? gistId : '')
    await fs.writeFile(GITHUB_TOKEN_FILE, tokenValid ? token : '')

    if (!gistIdValid) {
      echo(chalk.red('Error: Gist with id', `\`${gistId}\``, 'not found!'))
    }
    if (!tokenValid) {
      echo(
        chalk.red(
          'Error: Invalid token (Make sure the gist write permission is granted)',
        ),
      )
    }
    console.log()
    console.log('Done!')
  } catch (error) {
    echo(chalk.red('Error:', error))
    exit(1)
  }
}
