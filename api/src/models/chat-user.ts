import StandardModel from './standard-model'
import { Model } from 'objection'
import { Field, ObjectType } from 'type-graphql'
import path from 'path'
import { Chat, User, Message } from 'models'

@ObjectType('ChatUser')
export default class ChatUser extends StandardModel {
  static get tableName() {
    return 'chats_users'
  }

  static relationMappings = {
    chat: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'chat'),
      join: {
        from: 'chats_users.chatId',
        to: 'chats.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'user'),
      join: {
        from: 'chats_users.userId',
        to: 'users.id',
      },
    },
    messages: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'message'),
      join: {
        from: 'chats_users.id',
        to: 'messages.chatUserId',
      },
    },
  }

  chat?: Chat
  chatId!: string

  user?: User
  userId!: string

  messages?: Message[]
}
