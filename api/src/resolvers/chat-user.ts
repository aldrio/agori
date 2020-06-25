import { TrxContext } from 'server/middleware/transaction'
import { Ctx, Resolver, Root, FieldResolver } from 'type-graphql'
import { UserCtx } from 'server/create-context'
import { Message, ChatUser, User, Chat } from 'models'

@Resolver(ChatUser)
export default class ChatUserResolver {
  constructor() {}

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
    @Root() chatUser: ChatUser
  ): Promise<Chat> {
    if (!chatUser.chat) {
      await chatUser.$fetchGraph('chat', { transaction: await ctx.trx })
    }

    return chatUser.chat!
  }
}
