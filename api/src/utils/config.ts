import Knex from 'knex'

export type Configuration = {
  env: string

  logLevel: string

  dbConnection: Knex.Config

  webServer: {
    port: number
  }
}

const Config: Configuration = {
  env: process.env.NODE_ENV || 'dev',

  logLevel: process.env.API_LOG_LEVEL || 'debug',

  dbConnection: {
    client: process.env.API_DB_CLIENT,
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
}

export default Config
