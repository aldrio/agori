import { gql } from 'apollo-server-koa'
import {
  createUserTestClient,
  createAdminTestClient,
} from 'tests/utils/test-client'
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

const createInterest = async (
  label: string,
  description: string
): Promise<{
  id: string
  label: string
  description: string
}> => {
  const admin = await createAdminTestClient()
  // Create an interest
  const res = await admin.mutate({
    mutation: gql`
      mutation {
        createInterest(
          newInterest: { label: "${label}", description: "${description}" }
        ) {
          id
          label
          description
        }
      }
    `,
  })

  return res.data!.createInterest
}

describe('Interests', () => {
  it('Allows admins to create interests', async () => {
    const admin = await createAdminTestClient()

    const label = 'Hello'
    const description = 'Im a description'

    // Create an interest
    const res = await admin.mutate({
      mutation: gql`
        mutation {
          createInterest(
            newInterest: { label: "${label}", description: "${description}" }
          ) {
            id
            label
            description
          }
        }
      `,
    })

    expect(res.errors).toBeFalsy()
    expect(res.data).toBeTruthy()

    expect(res.data!.createInterest.label).toBe(label)
    expect(res.data!.createInterest.description).toBe(description)
  })

  it('Allows admins to delete interests', async () => {
    const admin = await createAdminTestClient()

    // Create an interest
    const addRes = await admin.mutate({
      mutation: gql`
        mutation {
          createInterest(
            newInterest: { label: "Hello", description: "I'm an interest" }
          ) {
            id
            label
            description
          }
        }
      `,
    })

    // Delete interest
    const deleteRes = await admin.mutate({
      mutation: gql`
        mutation {
          deleteInterest(
            interestId: "${addRes.data!.createInterest.id}"
          )
        }
      `,
    })

    expect(deleteRes.errors).toBeFalsy()
    expect(deleteRes.data!.deleteInterest).toBe(true)

    // Query interests
    const listRes = await admin.query({
      query: gql`
        query {
          interests {
            id
          }
        }
      `,
    })

    expect(listRes.data!.interests.length).toBe(0)
  })

  it('Doesnt allow users to create interests', async () => {
    const user = await createUserTestClient()

    // Try to create an interest
    const res = await user.mutate({
      mutation: gql`
        mutation {
          createInterest(
            newInterest: { label: "Hello", description: "I'm an interest" }
          ) {
            id
          }
        }
      `,
    })

    expect(res.data).toBeFalsy()
    expect(res.errors).toBeTruthy()
  })

  it('Doesnt allow users to delete interests', async () => {
    const admin = await createAdminTestClient()
    const user = await createUserTestClient()

    // Create an interest as an admin
    const addRes = await admin.query({
      query: gql`
        mutation {
          createInterest(
            newInterest: { label: "Hello", description: "I'm an interest" }
          ) {
            id
            label
            description
          }
        }
      `,
    })

    // Try to delete interest as user
    const deleteRes = await user.query({
      query: gql`
        mutation {
          deleteInterest(
            interestId: "${addRes.data!.createInterest.id}"
          )
        }
      `,
    })

    expect(deleteRes.data).toBeFalsy()
    expect(deleteRes.errors).toBeTruthy()
  })

  it('Allows users to add and remove interests', async () => {
    const interests = await Promise.all([
      createInterest('A', 'Interest A'),
      createInterest('B', 'Interest B'),
      createInterest('C', 'Interest C'),
    ])

    const bob = await createUserTestClient('Bob')

    // Add interest to bob
    const addRes = await bob.mutate({
      mutation: gql`
        mutation {
          addA: addInterest(interestId: "${interests[0].id}") {
            interests {
              id
            }
          }
          addC: addInterest(interestId: "${interests[2].id}") {
            interests {
              id
            }
          }
        }
      `,
    })

    expect(addRes.errors).toBeFalsy()
    expect(addRes.data!.addC.interests.length).toBe(2)

    // Add interest to bob
    const removeRes = await bob.mutate({
      mutation: gql`
        mutation {
          removeInterest(interestId: "${interests[0].id}") {
            interests {
              id
            }
          }
        }
      `,
    })

    expect(removeRes.errors).toBeFalsy()
    expect(removeRes.data!.removeInterest.interests.length).toBe(1)

    expect(removeRes.data!.removeInterest.interests[0].id).toBe(interests[2].id)
  })
})
