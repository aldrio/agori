import User from 'models/user'
import { v4 as uuid } from 'uuid'
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

describe('Standard model', () => {
  it('whereNotDeleted hides soft deleted models', async () => {
    const abc = await User.query().insert({
      id: uuid(),
      displayName: 'abc',
    })
    await abc.$query().delete()

    expect(await User.query().whereNotDeleted().resultSize()).toBe(0)
  })

  it('whereDeleted shows soft deleted models', async () => {
    const abc = await User.query().insert({
      id: uuid(),
      displayName: 'abc',
    })
    await abc.$query().delete()

    expect(await User.query().whereDeleted().resultSize()).toBe(1)
  })

  it('undelete undeletes', async () => {
    const abc = await User.query().insert({
      id: uuid(),
      displayName: 'abc',
    })
    await abc.$query().delete()

    expect(await User.query().whereNotDeleted().resultSize()).toBe(0)

    await abc.$query().undelete()

    expect(await User.query().whereNotDeleted().resultSize()).toBe(1)
  })

  it('hardDelete really deletes', async () => {
    const abc = await User.query().insert({
      id: uuid(),
      displayName: 'abc',
    })
    await abc.$query().hardDelete()

    expect(await User.query().resultSize()).toBe(0)
  })

  it('updatedAt updates', async () => {
    const abc = await User.query().insert({
      id: uuid(),
      displayName: 'abc',
    })

    await abc.$query().patch({
      displayName: 'bob',
    })

    const user = await User.query().first()
    expect(user.updatedAt.isAfter(user.createdAt)).toBeTruthy()
  })
})
