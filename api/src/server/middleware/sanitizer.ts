import { MiddlewareFn } from 'type-graphql'
import { sanitize } from 'class-sanitizer'

/**
 * Maps custom types to ones graphql understands
 */
export const Sanitizer: MiddlewareFn = async ({ args }, next) => {
  // Sanitize all args
  Object.values(args).forEach((a) => sanitize(a))
  return await next()
}
