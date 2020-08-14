import { TransactionPlugin, TrxContext } from '.'

import { ApolloServer, gql } from 'apollo-server-koa'
import { createTestClient } from 'apollo-server-testing'
import { buildSchema, Mutation, Resolver, Query, Ctx } from 'type-graphql'
import testDatabaseConnection from 'tests/utils/test-database-connection'
import User from 'models/user'

beforeAll(async () => {
  await testDatabaseConnection.initDatabase()
})

beforeEach(async () => {
  await testDatabaseConnection.cleanDatabase()
})

afterAll(async () => {
  await testDatabaseConnection.destroyDatabase()
})

@Resolver()
class SomethingDoer {
  @Query((returns) => Boolean)
  blank() {
    return true
  }
  @Mutation((returns) => Boolean)
  async doAnError(@Ctx() ctx: TrxContext) {
    await User.query(await ctx.trx).insert({ displayName: 'abc' })
    throw new Error('wat')
  }
  @Mutation((returns) => Boolean)
  async doNoError(@Ctx() ctx: TrxContext) {
    await User.query(await ctx.trx).insert({ displayName: 'abc' })
    return true
  }
}

describe('transaction middleware', () => {
  it('rolls everything back on an error', async () => {
    const schema = await buildSchema({
      resolvers: [SomethingDoer],
    })
    const server = new ApolloServer({
      schema,
      plugins: [TransactionPlugin],
    })

    const { query } = createTestClient(server)
    const res = await query({
      query: gql`
        mutation {
          doAnError
        }
      `,
    })

    expect(res.data).toBeFalsy()
    expect(res.errors).toBeTruthy()

    const users = await User.query()
    expect(users.length).toBe(0)
  })

  it('commits when no error', async () => {
    const schema = await buildSchema({
      resolvers: [SomethingDoer],
    })
    const server = new ApolloServer({
      schema,
      plugins: [TransactionPlugin],
    })

    const { query } = createTestClient(server)
    const res = await query({
      query: gql`
        mutation {
          doNoError
        }
      `,
    })

    expect(res.errors).toBeFalsy()
    expect(res.data).toBeTruthy()

    const users = await User.query()
    expect(users.length).toBe(1)
  })
})
