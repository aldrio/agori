import { Context, Next } from 'koa'
import logger from 'utils/logger'
import fetch from 'node-fetch'
import jwkToPem from 'jwk-to-pem'
import jwt, { verify } from 'jsonwebtoken'
import Config from 'utils/config'

const log = logger.child({ module: 'auth' })

let withoutAuthMode = false
if (!Config.keycloak) {
  if (Config.env === 'production') {
    log.fatal('Keycloak is not configured')
    process.exit(1)
  }
  log.warn(
    'API is running without authentication configured! Any client can do anything!'
  )
  withoutAuthMode = true
}

const pemMap: Promise<Map<string, string>> = new Promise<Map<string, string>>(
  async (resolve, reject) => {
    if (withoutAuthMode) {
      resolve(new Map())
      return
    }

    try {
      const res = await fetch(
        `${Config.keycloak!.realmUrl}/protocol/openid-connect/certs`
      )

      const { keys } = await res.json()
      const pemMap = new Map()
      keys.forEach((key: any) => {
        const pem = jwkToPem(key)
        pemMap.set(key.kid, pem)
      })

      return resolve(pemMap)
    } catch (error) {
      reject(error)
    }
  }
).catch((error) => {
  log.fatal({ error }, 'error retrieving keys from keycloak')
  process.exit(1)
})

export type Authenticated = {
  token: any
  userId: string
  roles: string[]
}

/**
 * Returns authentication data or throws
 *
 * If KeyCloak isn't configured and it's not production mode this will allow
 * the token to be a JSON string containing a user id, roles array, etc.
 *
 * @param jwt
 */
export const jwtAuth = async (token: string): Promise<Authenticated> => {
  if (withoutAuthMode) {
    const userData = JSON.parse(token)
    return {
      token: userData,
      userId: userData.id,
      roles: userData.roles,
    }
  }

  const decoded = jwt.decode(token, { complete: true }) as any
  const payload = verify(token, (await pemMap).get(decoded.header.kid)!) as any

  return {
    token: payload,
    userId: payload.sub,
    roles: payload.resource_access[Config.keycloak!.clientId]?.roles || [],
  }
}

/**
 * Adds authentication info to the koa context
 */
export const koaAuth = async (ctx: Context, next: Next) => {
  try {
    const token = (ctx.header.authorization as string).replace(/^Bearer /, '')
    const auth = await jwtAuth(token)

    // Set up context
    ctx.state.token = auth.token
    ctx.state.userId = auth.userId
    ctx.state.roles = auth.roles
  } catch (_error) {
    ctx.state.token = undefined
    ctx.state.userId = undefined
    ctx.state.roles = undefined
  }

  return await next()
}
