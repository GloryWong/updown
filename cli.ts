#!/usr/bin/env zx

import { minimist, path } from 'zx'
import { upload } from './upload.ts'

function showHelp() {
  console.log(`
Usage: updown [options] [command]

Upload or download files to or from GitHub Gist

Options:
  --help, -h                Show this help message
  --version, -v             Show version

Commands:
  upload                    Upload files to Github Gist
  download                  Download files from Github Gist (Unsupported yet)
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
    alias: {
      h: 'help',
      v: 'version',
    },
  })

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
