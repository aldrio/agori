import Knex from 'knex'

export type Configuration = {
  env: string

  logLevel: string

  dbConnection: Knex.Config

  webServer: {
    port: number
  }

  keycloak?: {
    realmUrl: string
    clientId: string
  }

  s3: {
    endpoint?: string
    accessKey: string
    secretKey: string
    bucket: string
  }
}

const Config: Configuration = {
  env: process.env.NODE_ENV || 'dev',

  logLevel: process.env.API_LOG_LEVEL || 'debug',

  dbConnection: {
    client: 'pg',
    connection: process.env.API_DB_CONNECTION_STRING,
    useNullAsDefault: true,
    migrations: {
      directory: './src/models/_migrations',
    },
    seeds: {
      directory: './src/models/_seeds',
    },
  },

  webServer: {
    port: parseInt(process.env.API_WEB_SERVER_PORT || '8080'),
  },

  keycloak: process.env.API_KEYCLOAK_REALM_ENDPOINT
    ? {
        realmUrl: process.env.API_KEYCLOAK_REALM_ENDPOINT!,
        clientId: process.env.API_KEYCLOAK_CLIENT_ID!,
      }
    : undefined,

  s3: {
    endpoint: process.env.API_S3_ENDPOINT,
    accessKey: process.env.API_S3_ACCESS_KEY!,
    secretKey: process.env.API_S3_SECRET_KEY!,
    bucket: process.env.API_S3_BUCKET!,
  },
}

export default Config
