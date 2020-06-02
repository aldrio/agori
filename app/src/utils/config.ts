import Config from './config-local'

export default Config

export type Configuration = {
  apiUrl: string

  /**
   * Keycloak configuration
   */
  keycloakAuth: {
    url: string
    realm: string
    clientId: string
  }
}
