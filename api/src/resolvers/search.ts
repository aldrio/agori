import {
  Field,
  Resolver,
  Query,
  Args,
  ArgsType,
  Int,
  Authorized,
  Ctx,
  ObjectType,
} from 'type-graphql'
import { Min, Max } from 'class-validator'

import { User, InterestUser } from 'models'
import { TrxContext } from 'server/middleware/transaction'
import { UserCtx } from 'server/create-context'
import { fn, ref } from 'objection'

@ObjectType('UserSearchResult')
class UserSearchResult {
  @Field(() => User)
  user!: User
  @Field(() => Int)
  interestsInCommon!: number
}

@ArgsType()
class SearchArgs {
  @Field(() => Int)
  @Min(0)
  skip: number = 0

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take: number = 50
}

@Resolver(UserSearchResult)
export default class UserSearchResultResolver {
  @Authorized('USER')
  @Query(() => [UserSearchResult])
  async searchUsers(
    @Ctx() ctx: TrxContext & UserCtx,
    @Args() { skip, take }: SearchArgs
  ): Promise<UserSearchResult[]> {
    const users = (await User.query(await ctx.trx)
      .select(
        'users.*',
        fn.count(ref('interestUsers.id')).as('interestsInCommon')
      )
      .leftJoinRelated('interestUsers')
      .whereIn(
        'interestUsers.interestId',
        InterestUser.query(await ctx.trx)
          .select('interestId')
          .where({ userId: ctx.user!.id })
      )
      .groupBy('users.id')
      .orderBy(ref('interestsInCommon'), 'DESC')
      .offset(skip)
      .limit(take)) as (User & { interestsInCommon: number })[]

    return users.map((user) => {
      const result = new UserSearchResult()
      result.user = user
      result.interestsInCommon = user.interestsInCommon
      return result
    })
  }
}
