import { AuthChecker } from 'type-graphql'
import { UserCtx } from './create-context'

const authChecker: AuthChecker<UserCtx> = ({ context }, roles) => {
  if (roles.length === 0) {
    return true
  } else if (roles.length > 1) {
    throw new Error('Multiple auth guard roles are not supported')
  }

  // If any role is required you must at least be logged in
  if (!context.user) {
    return false
  }

  // Test required role
  const requiredRole = roles[0]
  return context.roles.includes(requiredRole)
}

export default authChecker
