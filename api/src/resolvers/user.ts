import {
  Field,
  Resolver,
  Query,
  Arg,
  Args,
  Mutation,
  InputType,
  ArgsType,
  Int,
  Ctx,
  ID,
  FieldResolver,
  Root,
  Authorized,
  UnauthorizedError,
} from 'type-graphql'
import { MaxLength, Min, Max, MinLength, IsEmail } from 'class-validator'
import { Trim, NormalizeEmail } from 'class-sanitizer'

import { User, Chat } from 'models'
import { Dayjs } from 'dayjs'
import { TrxContext } from 'server/middleware/transaction'
import { UserCtx, isAdmin } from 'server/create-context'

@InputType({ description: 'A new user input' })
class NewUserInput {
  @Field()
  @Trim()
  @MinLength(1)
  @MaxLength(30)
  displayName!: string

  @Field(() => String, { nullable: true })
  @NormalizeEmail()
  @IsEmail()
  email?: string

  @Field(() => Date, { nullable: true })
  @MaxLength(30)
  deletedAt?: Dayjs | null
}

@ArgsType()
class UsersArgs {
  @Field(() => Int)
  @Min(0)
  skip: number = 0

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take: number = 25
}

@Resolver(User)
export default class UserResolver {
  constructor() {}

  @Authorized('USER')
  @Query(() => User)
  async me(@Ctx() ctx: TrxContext & UserCtx): Promise<User> {
    return ctx.user!
  }

  @Authorized('USER')
  @Query(() => User)
  async user(@Arg('id', () => ID) id: string): Promise<User> {
    return await User.query().findById(id).throwIfNotFound()
  }

  @Authorized('ADMIN')
  @Mutation(() => User)
  async createUser(
    @Arg('newUser') newUser: NewUserInput,
    @Ctx() ctx: TrxContext
  ): Promise<User> {
    return await User.query(await ctx.trx).insert({
      displayName: newUser.displayName,
    })
  }

  // TODO: Make only for admins, users should search
  @Authorized('USER')
  @Query(() => [User])
  async users(@Args() { skip, take }: UsersArgs): Promise<User[]> {
    const users = await User.query()
      .orderBy('createdAt', 'DESC')
      .offset(skip)
      .limit(take)

    return users
  }

  @Authorized('USER')
  @FieldResolver(() => [Chat])
  async chats(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() user: User
  ): Promise<Chat[]> {
    // Only allow users to view their own chats
    if (!isAdmin(ctx)) {
      if (user.id !== ctx.user!.id) {
        throw new UnauthorizedError()
      }
    }

    if (!user.chats) {
      await user.$fetchGraph('chats', { transaction: await ctx.trx })
    }

    return user.chats!
  }
}
