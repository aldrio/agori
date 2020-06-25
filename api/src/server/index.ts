import Config from 'utils/config'
import logger from 'utils/logger'

import Koa from 'koa'

import { ApolloServer } from 'apollo-server-koa'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { buildSchema } from 'type-graphql'
import UserResolver from 'resolvers/user'
import ChatResolver from 'resolvers/chat'
import MessageResolver from 'resolvers/message'
import ChatUserResolver from 'resolvers/chat-user'
import handleError from './handle-error'
import createContext, { contextFromAuthentication } from './create-context'

import { Logger } from './middleware/logging'
import { MapTypes } from './middleware/map-types'
import { TransactionPlugin } from './middleware/transaction'
import { jwtAuth, koaAuth } from './middleware/auth'
import { Sanitizer } from './middleware/sanitizer'
import { execute, subscribe } from 'graphql'

export async function startServer() {
  // Create koa app
  const app = new Koa()
  app.use(koaAuth)

  // Create graphql schema
  const schema = await buildSchema({
    resolvers: [UserResolver, ChatResolver, MessageResolver, ChatUserResolver],
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

  const httpServer = app.listen(Config.webServer.port, () => {
    logger.info(
      {
        graphql: `http://0.0.0.0:${Config.webServer.port}${server.graphqlPath}`,
      },
      'server started'
    )

    // Start subscriptions server
    new SubscriptionServer(
      {
        execute: execute,
        subscribe: subscribe,
        schema: schema,
        onConnect: async (params: any) => {
          const auth = await jwtAuth(params.jwt)
          return await contextFromAuthentication(auth)
        },
        onDisconnect: () => {},
      },
      { path: '/graphql', server: httpServer }
    )
  })
}
