import * as Knex from 'knex'
import faker from 'faker'
import { Interest, User } from 'models'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  const deleted = await User.relatedQuery('interests').hardDelete()
  console.log('Deleted', deleted, 'interests_users')

  // Generate seeds
  const users = await User.query()
  const interests = await Interest.query()

  let total = 0

  await Promise.all(
    users.map(async (user) => {
      let ints = faker.helpers.shuffle(interests)
      ints = ints.slice(0, 5 + faker.random.number(13))
      total += ints.length
      await knex('interests_users').insert(
        ints.map((interest) => ({
          user_id: user.id,
          interest_id: interest.id,
        }))
      )
    })
  )

  console.log('Inserted', total, 'interests_users')
}
