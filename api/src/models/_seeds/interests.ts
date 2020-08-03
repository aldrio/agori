import * as Knex from 'knex'
import { v4 as uuid } from 'uuid'
import faker from 'faker'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('interests')
    .del()
    .then(() => {
      // Inserts seed entries
      const interests = []
      for (let i = 0; i < 30; i++) {
        const date = faker.date.past()
        interests.push({
          id: uuid(),
          created_at: date,
          updated_at: date,
          label: faker.lorem.word(),
          description: faker.lorem.words(9),
        })
      }

      return knex('interests').insert(interests)
    })
}
