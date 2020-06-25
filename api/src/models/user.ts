import StandardModel from './standard-model'
import { Model } from 'objection'
import { Field, ObjectType } from 'type-graphql'
import path from 'path'
import { Chat, ChatUser, Message } from 'models'

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
  }

  chatUsers?: ChatUser[]

  chats?: Chat[]

  messages?: Message[]

  @Field(() => String)
  displayName!: string
}
