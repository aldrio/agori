import logger from 'utils/logger'
import { GraphQLError, GraphQLFormattedError } from 'graphql'

import { ValidationError } from 'apollo-server-koa'
import {
  ArgumentValidationError,
  UnauthorizedError,
  ForbiddenError,
} from 'type-graphql'
import { NotFoundError } from 'objection'

/**
 * Log and map graphql errors
 *
 * @param error - The internal error
 * @returns The error that should be reported to the client
 */
export default function handleError(
  error: GraphQLError
): GraphQLFormattedError {
  logger.error({ error }, 'apollo error')

  // Whitelist some error types
  if (error instanceof ValidationError) {
    return error
  }
  if (error.originalError instanceof ArgumentValidationError) {
    return error
  }
  if (error.originalError instanceof UnauthorizedError) {
    return error
  }
  if (error.originalError instanceof ForbiddenError) {
    return error
  }
  if (error.originalError instanceof NotFoundError) {
    return error
  }

  // Return a generic error with limited information if it wasn't whitelisted
  return {
    message: 'Internal server error',
    locations: error.locations,
    path: error.path,
    extensions: {
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
    },
  }
}
