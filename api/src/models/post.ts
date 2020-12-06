import StandardModel from './standard-model'
import { Model } from 'objection'
import { Field, ObjectType } from 'type-graphql'
import path from 'path'
import { Interest, User } from 'models'

@ObjectType('Post')
export default class Post extends StandardModel {
  static get tableName(): string {
    return 'posts'
  }

  static relationMappings = {
    interest: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'interest'),
      join: {
        from: 'posts.interestId',
        to: 'interests.id',
      },
    },
    parentPost: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'post'),
      join: {
        from: 'posts.parentPostId',
        to: 'posts.id',
      },
    },
    childrenPosts: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'post'),
      join: {
        from: 'posts.id',
        to: 'posts.parentPostId',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'user'),
      join: {
        from: 'posts.userId',
        to: 'users.id',
      },
    },
  }

  interestId!: string
  interest?: Interest

  parentPostId!: string | null
  parentPost?: Post | null

  childrenPosts?: Post[]

  userId!: string
  user?: User

  @Field(() => String)
  content!: string
}
