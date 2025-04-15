import { $, chalk, os } from 'zx'
import logger from './logger.ts'
import stripAnsi from 'strip-ansi'

export function notify(text: string, title: string) {
  // Support MacOS only
  if (os.platform() !== 'darwin') return

  const { exitCode } = $.sync({ nothrow: true })`command -v osascript`
  if (exitCode !== 0) {
    logger.error(chalk.red('Notify error: osascript unsupported'))
    return
  }

  const script = `display notification "${
    stripAnsi(text)
  }" with title "${title}"`
  const { ok, message } = $.sync({
    nothrow: true,
  })`osascript -e ${script}`
  if (!ok) {
    logger.error(chalk.red('Notify error:', message))
  }
}
