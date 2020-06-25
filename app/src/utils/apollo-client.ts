import Config from './config'
import auth from './auth'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// Create a http link
const httpLink = new HttpLink({
  uri: Config.apiUrl,
  fetch: async (uri: RequestInfo, options: RequestInit) => {
    let authHeader: string = ''
    if (auth.loggedIn) {
      try {
        authHeader = `Bearer ${await auth.getJwt()}`
      } catch (error) {
        console.error('error getting jwt', error)
        throw error
      }
    }

    return fetch(uri, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: authHeader,
      },
    })
  },
})

// Create websocket link
const wsLink = new WebSocketLink({
  uri: Config.apiWsUrl,
  options: {
    reconnect: true,
    connectionCallback: (error, result) => {
      // TODO: handle
    },
    connectionParams: async () => ({
      jwt: await auth.getJwt(),
    }),
  },
})

export default new ApolloClient({
  link: ApolloLink.from([
    ApolloLink.split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink
    ),
  ]),
  cache: new InMemoryCache(),
})
