import Config from './config'
import auth from './auth'
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

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
