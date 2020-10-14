import * as Knex from 'knex'
import faker from 'faker'
import { Interest } from 'models'
import Objection from 'objection'
import dayjs from 'dayjs'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  await knex('interests_users').del()
  await knex('posts').del()
  const deleted = await Interest.query().hardDelete()
  console.log('Deleted', deleted, 'interests')

  // Generate seeds
  const interests: Objection.PartialModelObject<Interest>[] = []
  for (let i = 0; i < 30; i++) {
    const date = faker.date.past()
    interests.push({
      label: faker.lorem.word(),
      description: faker.lorem.words(9),
      createdAt: dayjs(date),
    })
  }

  await Interest.query().insert(interests)
  console.log('Inserted', interests.length, 'interests')
}
