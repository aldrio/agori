import StandardModel from './standard-model'
import { Model } from 'objection'
import { Field, ObjectType } from 'type-graphql'
import path from 'path'
import { Chat, ChatUser, Message, InterestUser, Interest } from 'models'

@ObjectType('User')
export default class User extends StandardModel {
  static get tableName() {
    return 'users'
  }

  static relationMappings = {
    chatUsers: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'chat-user'),
      join: {
        from: 'users.id',
        to: 'chats_users.userId',
      },
    },
    chats: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, 'chat'),
      join: {
        from: 'users.id',
        through: {
          from: 'chats_users.userId',
          to: 'chats_users.chatId',
        },
        to: 'chats.id',
      },
    },
    messages: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, 'message'),
      join: {
        from: 'users.id',
        through: {
          from: 'chats_users.userId',
          to: 'chats_users.id',
        },
        to: 'messages.chatUserId',
      },
    },
    interestUsers: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'interest-user'),
      join: {
        from: 'users.id',
        to: 'interests_users.userId',
      },
    },
    interests: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, 'interest'),
      join: {
        from: 'users.id',
        through: {
          from: 'interests_users.userId',
          to: 'interests_users.interestId',
        },
        to: 'interests.id',
      },
    },
  }

  chatUsers?: ChatUser[]

  chats?: Chat[]

  messages?: Message[]

  interestUsers?: InterestUser[]

  interests?: Interest[]

  @Field(() => String)
  displayName!: string

  @Field(() => String, { nullable: true })
  bio!: string | null
}
