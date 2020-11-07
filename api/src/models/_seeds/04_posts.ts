import * as Knex from 'knex'
import { v4 as uuid } from 'uuid'
import faker from 'faker'
import { Interest, Post, User } from 'models'
import Objection from 'objection'
import dayjs from 'dayjs'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  const deleted = await Post.query().hardDelete()
  console.log('Deleted', deleted, 'posts')

  // Generate seeds
  const interests = await Interest.query()
  const users = await User.query()

  const topLevelPosts: Objection.PartialModelObject<Post>[] = []
  const posts: Objection.PartialModelObject<Post>[] = []
  for (let i = 0; i < 1000; i++) {
    const date1 = faker.date.recent()
    const date2 = Math.random() < 0.9 ? date1 : faker.date.past()

    const post: Objection.PartialModelObject<Post> = {
      id: uuid(),
      userId: faker.helpers.randomize(users).id,
      content: faker.lorem.text(),
      createdAt: dayjs(Math.min(date1.getTime(), date2.getTime())),
      updatedAt: dayjs(Math.max(date1.getTime(), date2.getTime())),
    }

    if (Math.random() < 0.75 && i !== 0) {
      const parentPost = faker.helpers.randomize(topLevelPosts)
      post.parentPostId = parentPost.id!
      post.interestId = parentPost.interestId!
    } else {
      post.interestId = faker.helpers.randomize(interests).id
      topLevelPosts.push(post)
    }

    posts.push(post)
  }

  await Post.query().insert(posts)
  console.log('Inserted', posts.length, 'posts')
}
