import * as Knex from 'knex'
import { v4 as uuid } from 'uuid'
import faker from 'faker'
import { getRandomAvatarDesignData } from '../../utils/avatar-renderer/pieces'
import { renderAvatarToPngBuffer } from '../../utils/avatar-renderer'
import { uploadBuffer } from '../../utils/media'

// NOTE: imports are broken when running directly with knex
// right now just running this manually when starting the server

export async function seed(knex: Knex): Promise<any> {
  const users: any[] = []

  for (let i = 0; i < 200; i++) {
    const avatarData = getRandomAvatarDesignData()
    const buffer = await renderAvatarToPngBuffer(avatarData, 300)

    const userId = uuid()

    // const avatarThumbnailUrl = faker.internet.url()
    const avatarThumbnailUrl = await uploadBuffer(
      `avatars/${userId}/${new Date().getTime()}.png`,
      buffer,
      'image/png'
    )

    const user = {
      id: userId,
      display_name: faker.internet.userName(),
      bio: faker.lorem.paragraphs(faker.random.number(3)),
      avatar_data: JSON.stringify(avatarData),
      avatar_thumbnail_url: avatarThumbnailUrl,
      created_at: new Date(),
      updated_at: new Date(),
    }

    users.push(user)
  }

  await knex('users').insert(users)

  const interests = await knex('interests')

  for (let i = 0; i < users.length; i++) {
    let ints = faker.helpers.shuffle(interests)
    ints = ints.slice(0, 5 + faker.random.number(13))
    await knex('interests_users').insert(
      ints.map((interest) => ({
        user_id: users[i].id,
        interest_id: interest.id,
      }))
    )
  }
}
