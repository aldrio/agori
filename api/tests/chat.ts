import { gql } from 'apollo-server-koa'
import { v4 as uuid } from 'uuid'
import { createUserTestClient } from 'tests/utils/test-client'
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

describe('Chat', () => {
  it('Create private chats', async () => {
    const bob = await createUserTestClient('Bob')
    const alice = await createUserTestClient('Alice')

    // Test getting private chat from bob to alice
    const res = await bob.query({
      query: gql`
        query {
          privateChat(userId: "${alice.user.id}") {
            id
          }
        }
      `,
    })

    expect(res.data).toBeTruthy()
    expect(res.errors).toBeFalsy()
  })

  it('Creates same chat both ways', async () => {
    const bob = await createUserTestClient('Bob')
    const alice = await createUserTestClient('Alice')

    // Test getting private chat in both directions bob->alice and alice->bob
    const bobChat = await bob.query({
      query: gql`
        query {
          privateChat(userId: "${alice.user.id}") {
            id
          }
        }
      `,
    })
    const aliceChat = await alice.query({
      query: gql`
        query {
          privateChat(userId: "${bob.user.id}") {
            id
          }
        }
      `,
    })

    expect(bobChat.errors).toBeFalsy()
    expect(aliceChat.errors).toBeFalsy()
    expect(bobChat.data!.privateChat.id).toEqual(aliceChat.data!.privateChat.id)
  })

  it('Doesnt create chat with self', async () => {
    const bob = await createUserTestClient('Bob')

    // Test getting private chat in both directions bob->alice and alice->bob
    const res = await bob.query({
      query: gql`
        query {
          privateChat(userId: "${bob.user.id}") {
            id
          }
        }
      `,
    })

    expect(res.errors).toBeTruthy()
    expect(res.data).toBeFalsy()
  })

  it('Doesnt create chat with unknown users', async () => {
    const bob = await createUserTestClient('Bob')

    // Test getting private chat in both directions bob->alice and alice->bob
    const res = await bob.query({
      query: gql`
        query {
          privateChat(userId: "${uuid()}") {
            id
          }
        }
      `,
    })

    expect(res.errors).toBeTruthy()
    expect(res.data).toBeFalsy()
  })

  it('Keeps private chats private', async () => {
    const bob = await createUserTestClient('Bob')
    const alice = await createUserTestClient('Alice')
    const jane = await createUserTestClient('Jane')

    // Test getting private chat in both directions bob->alice and alice->bob
    const bobAliceChat = await bob.query({
      query: gql`
        query {
          privateChat(userId: "${alice.user.id}") {
            id
          }
        }
      `,
    })
    const bobAliceChatId = bobAliceChat.data!.privateChat.id
    expect(bobAliceChatId).toBeTruthy()

    // Alice should be able to access her private chat with bob
    const goodChat = await alice.query({
      query: gql`
        query {
          chat(id: "${bobAliceChatId}") {
            id
          }
        }
      `,
    })
    expect(goodChat.data).toBeTruthy()

    // Jane should not be able to access jane and bob's private chat
    const badChat = await jane.query({
      query: gql`
        query {
          chat(id: "${bobAliceChatId}") {
            id
          }
        }
      `,
    })
    expect(badChat.data).toBeFalsy()
  })
})
