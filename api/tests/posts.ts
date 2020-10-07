import { gql } from 'apollo-server-koa'
import {
  createAdminTestClient,
  createUserTestClient,
} from 'tests/utils/test-client'
import testDatabaseConnection from 'tests/utils/test-database-connection'
import { Interest, User } from 'models'
import { ApolloServerTestClient } from 'apollo-server-testing'

beforeAll(async () => {
  await testDatabaseConnection.initDatabase()
})

const INTEREST_ID = '00000000-0000-0000-0000-000000000000'

beforeEach(async () => {
  await testDatabaseConnection.cleanDatabase()

  // Add interest
  await Interest.query().insert({
    id: INTEREST_ID,
    label: 'An Interest',
    description: 'Cool interesting and nice',
  })
})

afterAll(async () => {
  await testDatabaseConnection.destroyDatabase()
})

describe('Post is created', () => {
  let mary: ApolloServerTestClient & { user: User }
  let createPost: { errors?: any; data?: any }

  beforeEach(async () => {
    mary = await createUserTestClient('Mary')
    createPost = await mary.mutate({
      mutation: gql`
        mutation {
          createPost(interestId: "${INTEREST_ID}", content: "Hello") {
            id
          }
        }
      `,
    })
  })

  it('succeeds', async () => {
    expect(createPost.errors).toBeFalsy()
    expect(createPost.data).toBeTruthy()
  })

  it('can be edited', async () => {
    const editPost = await mary.mutate({
      mutation: gql`
        mutation {
          editPost(id: "${createPost.data.createPost.id}", content: "I'm mary") {
            id
            content
          }
        }
      `,
    })

    expect(editPost.errors).toBeFalsy()
    expect(editPost.data).toBeTruthy()
  })

  it("can't be edited by someone else", async () => {
    const bob = await createUserTestClient('Bob')
    const editPost = await bob.mutate({
      mutation: gql`
        mutation {
          editPost(id: "${createPost.data!.createPost.id}", content: "hacked") {
            id
          }
        }
      `,
    })

    expect(editPost.errors).toBeTruthy()
    expect(editPost.data).toBeFalsy()
  })

  it('can be edited by admin', async () => {
    const harry = await createAdminTestClient('Harry')
    const editPost = await harry.mutate({
      mutation: gql`
        mutation {
          editPost(id: "${createPost.data!.createPost.id}", content: "Admin") {
            id
          }
        }
      `,
    })

    expect(editPost.errors).toBeFalsy()
    expect(editPost.data).toBeTruthy()
  })

  it('Can be deleted', async () => {
    const editPost = await mary.mutate({
      mutation: gql`
        mutation {
          editPost(id: "${createPost.data!.createPost.id}", delete: true) {
            id
            deletedAt
          }
        }
      `,
    })

    expect(editPost.errors).toBeFalsy()
    expect(editPost.data).toBeTruthy()
    expect(editPost.data!.editPost.deletedAt).toBeTruthy()
  })

  it('can be commented on', async () => {
    const bob = await createUserTestClient('Bob')
    const createComment = await bob.mutate({
      mutation: gql`
        mutation {
          createPost(parentPostId: "${
            createPost.data!.createPost.id
          }", content: "I'm responding") {
            id
          }
        }
      `,
    })

    expect(createComment.errors).toBeFalsy()
    expect(createComment.data).toBeTruthy()
  })
})
