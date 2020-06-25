import StandardModel from './standard-model'
import { Model } from 'objection'
import { Field, ObjectType } from 'type-graphql'
import path from 'path'
import { ChatUser, Chat, User } from 'models'

@ObjectType('Message')
export default class Message extends StandardModel {
  static get tableName() {
    return 'messages'
  }

  static relationMappings = {
    chatUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'chat-user'),
      join: {
        from: 'messages.chatUserId',
        to: 'chats_users.id',
      },
    },
    user: {
      relation: Model.HasOneThroughRelation,
      modelClass: path.join(__dirname, 'user'),
      join: {
        from: 'messages.chatUserId',
        through: {
          from: 'chats_users.id',
          to: 'chats_users.userId',
        },
        to: 'users.id',
      },
    },
    chat: {
      relation: Model.HasOneThroughRelation,
      modelClass: path.join(__dirname, 'chat'),
      join: {
        from: 'messages.chatUserId',
        through: {
          from: 'chats_users.id',
          to: 'chats_users.chatId',
        },
        to: 'chats.id',
      },
    },
  }

  chatUser?: ChatUser
  chatUserId!: string

  user?: User

  chat?: Chat

  @Field(() => String)
  content!: string
}
