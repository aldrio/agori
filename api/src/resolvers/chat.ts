import { TrxContext } from 'server/middleware/transaction'
import {
  Ctx,
  Resolver,
  Arg,
  Root,
  Query,
  ID,
  FieldResolver,
  Authorized,
} from 'type-graphql'
import { UserCtx, isAdmin } from 'server/create-context'
import { User, Chat, Message, ChatUser } from 'models'
import { fn, ref } from 'objection'

@Resolver(Chat)
export default class ChatResolver {
  constructor() {}

  @Authorized('USER')
  @Query(() => Chat)
  async privateChat(
    @Ctx() ctx: TrxContext & UserCtx,
    @Arg('userId', () => ID) userId: string
  ): Promise<Chat> {
    if (ctx.user?.id === userId) {
      throw new Error("Can't create private chat with one user")
    }

    // Try to find an existing chat with these two users

    const chats = await Chat.query(await ctx.trx)
      .withGraphFetched('[users]')
      .where({ private: true })

    let chat = chats.find((c) => {
      if (c.users!.length !== 2) {
        return false
      }
      if (c.users!.findIndex((u) => u.id === ctx.user!.id) < 0) {
        return false
      }
      if (c.users!.findIndex((u) => u.id === userId) < 0) {
        return false
      }

      return true
    })

    // Create a new chat if it doesn't exist
    if (!chat) {
      // Ensure the other user exists
      if (!(await User.query(await ctx.trx).findById(userId))) {
        throw new Error('User does not exist')
      }
      chat = await Chat.query(await ctx.trx).insertAndFetch({
        private: true,
      })
      await chat
        .$relatedQuery('users', await ctx.trx)
        .relate([ctx.user!.id, userId])
    }

    await chat.$fetchGraph('[chatUsers.user]', { transaction: await ctx.trx })

    return chat
  }

  @FieldResolver(() => [Message])
  async recentMessages(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() chat: Chat,
    @Arg('markRead', () => Boolean, { nullable: true }) markRead: boolean = true
  ): Promise<Message[]> {
    const messages = await chat
      .$relatedQuery('messages', await ctx.trx)
      .withGraphFetched('[chatUser.user]')
      .orderBy('createdAt', 'DESC')
      .limit(30)

    // If logged in and part of this chat set the read status
    if (markRead && ctx.user && messages.length > 0) {
      const m = messages[0]
      // Mark read status up to this message
      await ChatUser.query(await ctx.trx)
        .where({
          userId: ctx.user!.id,
          chatId: chat.id,
        })
        .where(
          fn.coalesce(ref('lastReadTime'), new Date(0)),
          '<',
          m.createdAt.toDate()
        )
        .patch({
          lastReadTime: m.createdAt,
        })
    }
    return messages
  }

  @FieldResolver(() => [ChatUser])
  async chatUsers(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() chat: Chat
  ): Promise<ChatUser[]> {
    if (!chat.chatUsers) {
      chat.$fetchGraph('chatUsers.user', { transaction: await ctx.trx })
    }
    return chat.chatUsers!
  }

  @Authorized('USER')
  @FieldResolver(() => ChatUser, { nullable: true })
  async myChatUser(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() chat: Chat
  ): Promise<ChatUser | null> {
    // TODO: in the future with very popular chats it may be quicker to do a dedicated query
    const chatUsers = await this.chatUsers(ctx, chat)

    return chatUsers.find((cu) => cu.id === ctx.user!.id) || null
  }

  @Authorized('USER')
  @Query(() => Chat)
  async chat(
    @Ctx() ctx: TrxContext & UserCtx,
    @Arg('id', () => ID) id: string
  ): Promise<Chat> {
    if (isAdmin(ctx)) {
      return await Chat.query(await ctx.trx)
        .findById(id)
        .throwIfNotFound()
    } else {
      const chatUser = await ChatUser.query(await ctx.trx)
        .where({
          userId: ctx.user!.id,
          chatId: id,
        })
        .withGraphFetched('chat')
        .throwIfNotFound()
        .first()

      return chatUser.chat!
    }
  }
}
