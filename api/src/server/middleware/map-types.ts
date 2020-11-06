import { MiddlewareFn } from 'type-graphql'
import dayjs from 'dayjs'

/**
 * Maps custom types to ones graphql understands
 */
export const MapTypes: MiddlewareFn = async (_, next) => {
  const result: unknown = await next()

  if (dayjs.isDayjs(result)) {
    return result.toDate()
  } else {
    return result
  }
}
