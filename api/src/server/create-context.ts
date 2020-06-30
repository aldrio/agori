import User from 'models/user'
import logger from 'utils/logger'
import { Authenticated } from './middleware/auth'

const log = logger.child({ module: 'create-context' })

export interface UserCtx {
  user: User | null
  roles: string[]
}

export const isUser = (userCtx: UserCtx) => {
  return userCtx.roles.includes('USER')
}

export const isAdmin = (userCtx: UserCtx) => {
  return userCtx.roles.includes('ADMIN')
}

/**
 * Creates the context for graphql queries
 *
 * @returns The context
 */
export default async function createContext({ ctx }: any): Promise<UserCtx> {
  const { userId, roles, token } = ctx.state

  if (userId) {
    return contextFromAuthentication({
      userId,
      token,
      roles,
    })
  } else {
    return {
      user: null,
      roles: [],
    }
  }
}

/**
 * Generates a context from an authentication
 */
export const contextFromAuthentication = async ({
  userId,
  roles,
  token,
}: Authenticated): Promise<UserCtx> => {
  let user = await User.query().findById(userId)
  if (!user) {
    user = await User.query().insert({
      id: userId,
      displayName: token.preferred_username,
    })
    log.info({ user }, 'inserted new user')
  }

  return {
    user: user,
    roles: roles,
  }
}
