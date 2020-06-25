import { TrxContext } from 'server/middleware/transaction'
import {
  Ctx,
  Resolver,
  Root,
  FieldResolver,
  Mutation,
  PubSub,
  PubSubEngine,
  Arg,
  ID,
  InputType,
  Field,
  Subscription,
} from 'type-graphql'
import { UserCtx } from 'server/create-context'
import { Message, ChatUser, User, Chat } from 'models'
import { Trim } from 'class-sanitizer'
import { MinLength, MaxLength } from 'class-validator'

@InputType({ description: 'A new message input' })
class NewMessageInput {
  @Field()
  @Trim()
  @MinLength(1)
  @MaxLength(5000)
  content!: string
}

@Resolver(Message)
export default class MessageResolver {
  constructor() {}

  @FieldResolver(() => ChatUser)
  async chatUser(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() message: Message
  ): Promise<ChatUser> {
    if (!message.chatUser) {
      await message.$fetchGraph('chatUser.user', { transaction: await ctx.trx })
    }

    return message.chatUser!
  }

  @FieldResolver(() => User)
  async user(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() message: Message
  ): Promise<User> {
    if (!message.user) {
      await message.$fetchGraph('user', { transaction: await ctx.trx })
    }

    return message.user!
  }

  @FieldResolver(() => Chat)
  async chat(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() message: Message
  ): Promise<Chat> {
    if (!message.chat) {
      await message.$fetchGraph('chat', { transaction: await ctx.trx })
    }

    return message.chat!
  }

  @Mutation(() => Message)
  async sendNewMessage(
    @Ctx() ctx: TrxContext & UserCtx,
    @PubSub() pubSub: PubSubEngine,
    @Arg('chatId', () => ID) chatId: string,
    @Arg('newMessage') newMessage: NewMessageInput
  ): Promise<Message> {
    const chatUser = await ChatUser.query(await ctx.trx)
      .where({
        userId: ctx.user!.id,
        chatId,
      })
      .first()

    if (!chatUser) {
      throw new Error("Can't send a message to this chat")
    }

    let message = await Message.query(await ctx.trx).insertAndFetch({
      chatUserId: chatUser.id,
      content: newMessage.content,
    })

    message = await message.$fetchGraph('[chat,chatUser.[user]]', {
      transaction: await ctx.trx,
    })

    await pubSub.publish('CHAT_NEW_MESSAGES', message)
    return message
  }

  @Subscription(() => Message, { topics: 'CHAT_NEW_MESSAGES' })
  async newMessageSent(@Root() message: Message): Promise<Message> {
    return message
  }
}
