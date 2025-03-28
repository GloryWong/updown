import { $ as _$, ProcessPromise, spinner } from 'zx'
import logger from './logger.ts'

type SpinnerExecCallback = ($: typeof _$) => ProcessPromise

export async function spinnerExec(
  ongoingText: string,
  failureText: string,
  finishText: string,
  callback: SpinnerExecCallback,
) {
  const output = await spinner(
    ongoingText,
    () => callback(_$({ nothrow: true })),
  )
  if (!output.ok) {
    throw new Error(`${failureText}. ${output.message}`)
  }
  logger.log(finishText)
  return output
}
