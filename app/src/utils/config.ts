import Config from './config-local'

export default Config

export type Configuration = {
  apiUrl: string
  apiWsUrl: string

  /**
   * Keycloak configuration
   */
  keycloak: {
    realmUrl: string
    clientId: string
  }

  sentryDsn?: string
}
