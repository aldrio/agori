import ApolloClient from 'apollo-boost'
import Config from './config'
import auth from './auth'

export default new ApolloClient({
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
