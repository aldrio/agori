import { Context, Next } from 'koa'
import logger from 'utils/logger'
import fetch from 'node-fetch'
import jwkToPem, { JWK } from 'jwk-to-pem'
import jwt, { verify } from 'jsonwebtoken'

const log = logger.child({ module: 'auth' })

const pemMap: Promise<Map<string, string>> = new Promise<Map<string, string>>(
  async (resolve, reject) => {
    try {
      const res = await fetch(
        `https://keycloak.cluster.aldr.io/auth/realms/agori/protocol/openid-connect/certs`
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

export default async (ctx: Context, next: Next) => {
  try {
    const token = (ctx.header.authorization as string).replace(/^Bearer /, '')
    const decoded = jwt.decode(token, { complete: true }) as any
    const payload = verify(
      token,
      (await pemMap).get(decoded.header.kid)!
    ) as any

    // Set up context
    ctx.state.token = payload
    ctx.state.userId = payload.sub
    ctx.state.roles = payload.resource_access['agori-app']
  } catch (_error) {
    ctx.state.token = undefined
    ctx.state.userId = undefined
    ctx.state.roles = undefined
  }

  return await next()
}
