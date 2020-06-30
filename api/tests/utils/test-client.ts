import { createSchema, getGraphQLPlugins } from 'server'
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'
import { gql, ApolloServer } from 'apollo-server-koa'
import { v4 as uuid } from 'uuid'
import { contextFromAuthentication } from 'server/create-context'
import { User } from 'models'

const schema = createSchema(false)
const plugins = getGraphQLPlugins()

export async function createUserTestClient(
  displayName: string = 'UserPerson',
  roles: string[] = ['USER'],
  userId: string = uuid()
): Promise<ApolloServerTestClient & { user: User }> {
  const server = new ApolloServer({
    schema,
    plugins,
    context: () => {
      return contextFromAuthentication({
        userId: userId,
        roles: roles,
        token: {
          preferred_username: displayName,
        },
      })
    },
  })
  const testClient = createTestClient(server)
  // Run random query to add user to db
  const res = await testClient.query({
    query: gql`
      query {
        me {
          id
        }
      }
    `,
  })

  // Fetch user model
  const user = await User.query().findById(res.data!.me.id)

  return { ...testClient, user }
}

export async function createAdminTestClient(
  displayName: string = 'AdminPerson',
  roles: string[] = ['ADMIN', 'USER'],
  userId: string = uuid()
): Promise<ApolloServerTestClient & { user: User }> {
  return await createUserTestClient(displayName, roles, userId)
}
