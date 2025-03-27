#!/usr/bin/env zx

import { minimist, path } from 'zx'
import { upload } from './upload.ts'
import { setEnv } from './utils/envs.ts'

function showHelp() {
  console.log(`
Usage: updown [options] [command]

Upload or download files to or from GitHub Gist

Commands:
  upload                    Upload files to Github Gist
  download                  Download files from Github Gist (Unsupported yet)

Options:
  --help, -h                Show this help message
  --version, -v             Show version
  --force-upload            Upload without checking file change
  --interactive, -i         Interaction mode. Enable prompts
  --gist-id                 Set gist id

Environment variables:
  UPDOWN_UPLOAD_FORCE       When true, it acts the same as --force-upload
  UPDOWN_INTERACTIVE        When true, it acts the same as --interactive
  UPDOWN_GIST_ID            Set gist id
`)
}

async function showVersion() {
  if (import.meta.dirname) {
    const version = (await Deno.readTextFile(
      path.join(import.meta.dirname, 'version.txt'),
    )).trim()
    console.log(version)
  }
}

async function main() {
  const argv = minimist(Deno.args, {
    boolean: ['help', 'version', 'interactive', 'force-upload'],
    string: ['gist-id'],
    alias: {
      h: 'help',
      v: 'version',
      i: 'interactive'
    },
  })

  if (argv['interactive']) {
    setEnv('UPDOWN_INTERACTIVE', true)
  }
  if (argv['force-upload']) {
    setEnv('UPDOWN_UPLOAD_FORCE', true)
  }
  if (argv['gist-id']) {
    setEnv('UPDOWN_GIST_ID', argv['gist-id'])
  }

  if (argv['_'].includes('upload')) {
    await upload()
    return
  }

  if (argv['version']) {
    await showVersion()
    return
  }

  // Anything else
  showHelp()
}

main()
