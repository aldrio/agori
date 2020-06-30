import { gql } from 'apollo-server-koa'
import { createAdminTestClient } from 'tests/utils/test-client'
import testDatabaseConnection from 'tests/utils/test-database-connection'

beforeAll(async () => {
  await testDatabaseConnection.initDatabase()
})

beforeEach(async () => {
  await testDatabaseConnection.cleanDatabase()
})

afterAll(async () => {
  await testDatabaseConnection.destroyDatabase()
})

describe('User resolver', () => {
  it('trims displayName', async () => {
    const admin = await createAdminTestClient()
    const res = await admin.query({
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
    const admin = await createAdminTestClient()
    const res = await admin.query({
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
