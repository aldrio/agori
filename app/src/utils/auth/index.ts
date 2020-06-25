import { AsyncStorage } from 'react-native'
import Config from 'utils/config'
import { observable, computed } from 'mobx'
import { create, persist } from 'mobx-persist'

type Tokens = {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  token_type: string
  not_before_policy: number
  session_state: string
  scope: string

  expiresAt: number
}

export class AuthManager {
  /**
   * Loading status of retrieving tokens from storage
   */
  @observable
  loading: boolean = true

  @persist('object')
  @observable
  tokens: Tokens | null = null

  constructor() {}

  /**
   * If the user is logged in
   */
  @computed
  get loggedIn(): boolean {
    return this.tokens !== null
  }

  /**
   * Returns a valid JWT
   */
  getJwt = async (forceRefresh: boolean = false): Promise<string | null> => {
    if (!this.tokens) {
      return null
    }

    if (forceRefresh || this.tokens.expiresAt - 15000 < Date.now()) {
      await this.refresh()
    }

    return this.tokens!.access_token
  }

  /**
   * Uses arguments to post to keycloak token endpoint and get new access and refresh tokens
   *
   * @param grantType - What kind of grant type to try for
   * @param args - Data associated with the grantType
   */
  private getTokens = async (
    grantType: string,
    args: object
  ): Promise<void> => {
    const body = {
      client_id: Config.keycloak.clientId,
      scope: 'offline_access',
      grant_type: grantType,
      ...args,
    }

    const res = await fetch(
      `${Config.keycloak.realmUrl}/protocol/openid-connect/token`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: Object.entries(body)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&'),
      }
    )

    const tokens = await res.json()

    if ('error' in tokens) {
      throw new Error(tokens['error_description'])
    }

    this.tokens = tokens
    this.tokens!.expiresAt = Date.now() + this.tokens!.expires_in * 1000
  }

  login = async (username: string, password: string) => {
    await this.getTokens('password', {
      username: username,
      password: password,
    })
  }

  refresh = async () => {
    await this.getTokens('refresh_token', {
      refresh_token: this.tokens?.refresh_token,
    })
  }

  logout = async () => {
    // TODO: Call backend to invalidate refresh token
    this.tokens = null
  }
}

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
})

const auth = new AuthManager()
hydrate('auth', auth)
  .then(() => console.log('Global AuthManager has been hydrated'))
  .catch((error) => console.log(error, 'Error hydrating global AuthManager'))
  .finally(() => {
    auth.loading = false
  })

export default auth
