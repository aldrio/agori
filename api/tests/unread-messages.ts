import { gql } from 'apollo-server-koa'
import { createUserTestClient } from 'tests/utils/test-client'
import testDatabaseConnection from 'tests/utils/test-database-connection'
import { ApolloServerTestClient } from 'apollo-server-testing'

beforeAll(async () => {
  await testDatabaseConnection.initDatabase()
})

beforeEach(async () => {
  await testDatabaseConnection.cleanDatabase()
})

afterAll(async () => {
  await testDatabaseConnection.destroyDatabase()
})

async function sendMessage(
  user: ApolloServerTestClient,
  chatId: string,
  content: string
) {
  await user.mutate({
    mutation: gql`
      mutation {
        sendNewMessage(
          chatId: "${chatId}",
          newMessage: {
            content: "${content}",
          }
        ) {
          id
        }
      }
    `,
  })
}

describe('Unread messages', () => {
  it('Gives count of unread messages', async () => {
    const bob = await createUserTestClient('Bob')
    const alice = await createUserTestClient('Alice')

    // Get private chat between bob and alice
    const chat = await bob.query({
      query: gql`
        query {
          privateChat(userId: "${alice.user.id}") {
            id
          }
        }
      `,
    })

    await sendMessage(bob, chat.data!.privateChat.id, '1')
    await sendMessage(bob, chat.data!.privateChat.id, '2')

    // Read the first messages as alice
    await alice.query({
      query: gql`
        query {
          privateChat(userId: "${bob.user.id}") {
            id
            recentMessages {
              id
            }
          }
        }
      `,
    })

    await sendMessage(bob, chat.data!.privateChat.id, '3')
    await sendMessage(bob, chat.data!.privateChat.id, '4')
    await sendMessage(bob, chat.data!.privateChat.id, '5')

    // Get chatUsers with unread count
    const res = await bob.query({
      query: gql`
        query {
          privateChat(userId: "${alice.user.id}") {
            id
            chatUsers {
              id
              unreadCount
              user {
                id
              }
            }
          }
        }
      `,
    })

    expect(res.errors).toBeFalsy()
    expect(res.data).toBeTruthy()

    const bobChatUser = res.data!.privateChat.chatUsers.find(
      (cu: any) => cu.user.id === bob.user.id
    )
    const aliceChatUser = res.data!.privateChat.chatUsers.find(
      (cu: any) => cu.user.id === alice.user.id
    )

    expect(bobChatUser.unreadCount).toBe(0)
    expect(aliceChatUser.unreadCount).toBe(3)
  })

  it('Allows not marking messages as read', async () => {
    const bob = await createUserTestClient('Bob')
    const alice = await createUserTestClient('Alice')

    // Get private chat between bob and alice
    const chat = await bob.query({
      query: gql`
        query {
          privateChat(userId: "${alice.user.id}") {
            id
          }
        }
      `,
    })

    await sendMessage(bob, chat.data!.privateChat.id, '1')
    await sendMessage(bob, chat.data!.privateChat.id, '2')

    // Read the first messages as alice
    await alice.query({
      query: gql`
        query {
          privateChat(userId: "${bob.user.id}", markRead: false) {
            id
            recentMessages {
              id
            }
          }
        }
      `,
    })

    await sendMessage(bob, chat.data!.privateChat.id, '3')
    await sendMessage(bob, chat.data!.privateChat.id, '4')
    await sendMessage(bob, chat.data!.privateChat.id, '5')

    // Get chatUsers with unread count
    const res = await bob.query({
      query: gql`
        query {
          privateChat(userId: "${alice.user.id}") {
            id
            chatUsers {
              id
              unreadCount
              user {
                id
              }
            }
          }
        }
      `,
    })

    expect(res.errors).toBeFalsy()
    expect(res.data).toBeTruthy()

    const bobChatUser = res.data!.privateChat.chatUsers.find(
      (cu: any) => cu.user.id === bob.user.id
    )
    const aliceChatUser = res.data!.privateChat.chatUsers.find(
      (cu: any) => cu.user.id === alice.user.id
    )

    expect(bobChatUser.unreadCount).toBe(0)
    expect(aliceChatUser.unreadCount).toBe(5)
  })
})
