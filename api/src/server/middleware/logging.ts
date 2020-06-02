import { MiddlewareFn } from 'type-graphql'
import logger from 'utils/logger'

/**
 * Logs resolveTime of root operations
 */
export const Logger: MiddlewareFn = async ({ info, root }, next) => {
  // Ignore nested fields
  if (root !== undefined) {
    return await next()
  }

  const start = Date.now()
  const result = await next()
  const resolveTime = Date.now() - start

  logger.debug(
    {
      path: `${info.parentType.name}.${info.fieldName}`,
      resolveTime: `${resolveTime}ms`,
      operation: info.operation.operation,
    },
    `resolved ${info.operation.operation}`
  )

  return result
}
