import User from 'models/user'
import logger from 'utils/logger'

const log = logger.child({ module: 'create-context' })

export interface UserCtx {
  user: User | null
  roles: string[]
}

/**
 * Creates the context for graphql queries
 *
 * @returns The context
 */
export default async function createContext({ ctx }: any): Promise<UserCtx> {
  const { userId, roles, token } = ctx.state

  if (userId) {
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
  } else {
    return {
      user: null,
      roles: [],
    }
  }
}
