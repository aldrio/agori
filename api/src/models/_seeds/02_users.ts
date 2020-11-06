import * as Knex from 'knex'
import { v4 as uuid } from 'uuid'
import faker from 'faker'
import { User } from 'models'
import Objection from 'objection'
import dayjs from 'dayjs'
import { getRandomAvatarDesignData, renderAvatarToPngBuffer } from 'avatars'
import { uploadBuffer } from 'utils/media'

export async function seed(_knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  const deleted = await User.query().hardDelete()
  console.log('Deleted', deleted, 'users')

  // Generate seeds
  const users = await Promise.all(
    [...Array(5)].map(
      async (): Promise<Objection.PartialModelObject<User>> => {
        const avatarData = getRandomAvatarDesignData()
        const buffer = await renderAvatarToPngBuffer({
          design: avatarData,
          size: 300,
        })

        const userId = uuid()

        // const avatarThumbnailUrl = faker.internet.url()
        const avatarThumbnailUrl = await uploadBuffer(
          `avatars/${userId}/${new Date().getTime()}.png`,
          buffer,
          'image/png'
        )

        const date1 = faker.date.past()
        const date2 = faker.date.past()

        return {
          id: userId,
          displayName: faker.internet.userName(),
          bio: faker.lorem.paragraphs(faker.random.number(3)),
          avatarData: JSON.stringify(avatarData),
          avatarThumbnailUrl: avatarThumbnailUrl,
          createdAt: dayjs(Math.min(date1.getTime(), date2.getTime())),
          updatedAt: dayjs(Math.max(date1.getTime(), date2.getTime())),
        }
      }
    )
  )

  await User.query().insert(users)
  console.log('Inserted', users.length, 'users')
}
