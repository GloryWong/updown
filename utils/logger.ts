import { getEnv } from './envs.ts'
import { notify } from './notify.ts'

function getCurrentDateTime() {
  return new Date().toLocaleString('zh-CN')
}

function getCurrentDateTimeNormalized() {
  return `[${getCurrentDateTime()}]`
}

function log(...args: Parameters<typeof console.log>) {
  if (!getEnv('UPDOWN_QUIET')) {
    console.log(...args)
  }
}

function logKeep(...args: Parameters<typeof console.log>) {
  if (getEnv('UPDOWN_QUIET')) {
    console.log(getCurrentDateTimeNormalized(), ...args)
  } else {
    console.log(...args)
  }
}

function error(...args: Parameters<typeof console.error>) {
  if (getEnv('UPDOWN_QUIET')) {
    console.error(getCurrentDateTimeNormalized(), ...args)
  } else {
    console.error(...args)
  }

  const text = args.join(' ')
  if (getEnv('UPDOWN_NOTIFY') && text.toLowerCase().includes('fatal error')) {
    notify(text, 'Updown Upload')
  }
}

const logger = {
  log,
  logKeep,
  error,
}

export default logger
