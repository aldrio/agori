import { TransactionPlugin } from 'server/middleware/transaction'

import { ApolloServer, gql } from 'apollo-server-koa'
import { createTestClient } from 'apollo-server-testing'
import { buildSchema } from 'type-graphql'
import { knex } from 'models'
import UserResolver from './user'
import { Sanitizer } from 'server/middleware/sanitizer'
import knexCleaner from 'knex-cleaner'

beforeAll(async () => {
  await knex.migrate.latest()
})

beforeEach(async () => {
  await knexCleaner.clean(knex, {
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
  })
})

afterAll(async () => {
  await knex.destroy()
})

describe('User resolver', () => {
  it('trims displayName', async () => {
    const schema = await buildSchema({
      resolvers: [UserResolver],
      globalMiddlewares: [Sanitizer],
    })
    const server = new ApolloServer({
      schema,
      plugins: [TransactionPlugin],
    })

    const { query } = createTestClient(server)
    const res = await query({
      query: gql`
        mutation {
          createUser(newUser: { displayName: "  wut  " }) {
            displayName
          }
        }
      `,
    })

    expect(res.errors).toBeFalsy()
    expect(res.data!.createUser.displayName).toBe('wut')
  })

  it('rejects displayName with only whitspace', async () => {
    const schema = await buildSchema({
      resolvers: [UserResolver],
      globalMiddlewares: [Sanitizer],
    })
    const server = new ApolloServer({
      schema,
      plugins: [TransactionPlugin],
    })

    const { query } = createTestClient(server)
    const res = await query({
      query: gql`
        mutation {
          createUser(newUser: { displayName: "    " }) {
            displayName
          }
        }
      `,
    })

    expect(res.errors).toBeTruthy()
    expect(res.data).toBeFalsy()
  })
})
