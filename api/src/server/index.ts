import Config from 'utils/config'
import logger from 'utils/logger'

import Koa from 'koa'

import { ApolloServer } from 'apollo-server-koa'
import { buildSchema } from 'type-graphql'
import UserResolver from 'resolvers/user'
import handleError from './handle-error'
import createContext from './create-context'

import { Logger } from './middleware/logging'
import { MapTypes } from './middleware/map-types'
import { TransactionPlugin } from './middleware/transaction'
import auth from './middleware/auth'
import { Sanitizer } from './middleware/sanitizer'

export async function startServer() {
  // Create koa app
  const app = new Koa()
  app.use(auth)

  // Create graphql schema
  const schema = await buildSchema({
    resolvers: [UserResolver],
    globalMiddlewares: [Logger, MapTypes, Sanitizer],
  })

  // Start graphql server
  const server = new ApolloServer({
    schema,
    plugins: [TransactionPlugin],
    playground: Config.env === 'dev',
    debug: Config.env === 'dev',
    formatError: handleError,
    context: createContext,
  })

  server.applyMiddleware({ app, path: '/graphql' })

  app.listen(Config.webServer.port, () => {
    logger.info(
      {
        graphql: `http://0.0.0.0:${Config.webServer.port}${server.graphqlPath}`,
      },
      'server started'
    )
  })
}
