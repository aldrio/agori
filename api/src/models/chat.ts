import StandardModel from './standard-model'
import { Model } from 'objection'
import { Field, ObjectType } from 'type-graphql'
import path from 'path'
import { ChatUser, Message, User } from 'models'

@ObjectType('Chat')
export default class Chat extends StandardModel {
  static get tableName() {
    return 'chats'
  }

  static relationMappings = {
    chatUsers: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'chat-user'),
      join: {
        from: 'chats.id',
        to: 'chats_users.chatId',
      },
    },
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, 'user'),
      join: {
        from: 'chats.id',
        through: {
          from: 'chats_users.chatId',
          to: 'chats_users.userId',
        },
        to: 'users.id',
      },
    },
    messages: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, 'message'),
      join: {
        from: 'chats.id',
        through: {
          from: 'chats_users.chatId',
          to: 'chats_users.id',
        },
        to: 'messages.chatUserId',
      },
    },
  }

  chatUsers?: ChatUser[]

  users?: User[]

  messages?: Message[]

  @Field(() => Boolean)
  private!: boolean

  @Field(() => String, { nullable: true })
  displayName?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null
}
