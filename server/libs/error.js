import { ERROR_CODE } from './assets.js'
import { dateFormat } from './date.js'

export function register(res, err, returning = false)
{
  // TODO: 좀더 개선할 필요가 있을것이다.
  let dev = process.env.NODE_ENV === 'development'
  let status
  let message
  let date = new Date()
  switch (err.status)
  {
    case ERROR_CODE.NOT_FOUND:
      status = 404
      message = 'Not found item'
      break
    case ERROR_CODE.UNKNOWN:
    case ERROR_CODE.FAILED_UPDATE:
    default:
      status = 500
      message = 'Service error'
      break
  }

  // console
  if (dev)
  {
    console.group('> SERVICE ERROR')
    console.error(`- Status: [${status}] ${err.status || 'unknown error'}`)
    console.error(`- Date: ${dateFormat(date, '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}')}`)
    console.error(`- Message: ${err.message}`)
    console.groupEnd()
  }

  return { status, message }
}
