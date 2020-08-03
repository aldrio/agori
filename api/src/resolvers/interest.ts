import { TrxContext } from 'server/middleware/transaction'
import {
  Ctx,
  Resolver,
  Arg,
  Query,
  ID,
  Authorized,
  InputType,
  Field,
  Mutation,
} from 'type-graphql'
import { UserCtx } from 'server/create-context'
import { User, Interest } from 'models'
import { Trim } from 'class-sanitizer'
import { MinLength, MaxLength } from 'class-validator'
import { UniqueViolationError } from 'objection'

@InputType({ description: 'A new interest input' })
class NewInterestInput {
  @Field()
  @Trim()
  @MinLength(1)
  @MaxLength(30)
  label!: string

  @Field()
  @Trim()
  @MinLength(1)
  @MaxLength(300)
  description!: string
}

@Resolver(Interest)
export default class InterestResolver {
  constructor() {}

  @Authorized('USER')
  @Query(() => Interest)
  async interest(
    @Ctx() ctx: TrxContext & UserCtx,
    @Arg('id', () => ID) id: string
  ): Promise<Interest> {
    return await Interest.query(await ctx.trx)
      .findById(id)
      .throwIfNotFound()
  }

  @Authorized('USER')
  @Query(() => [Interest])
  async interests(@Ctx() ctx: TrxContext & UserCtx): Promise<Interest[]> {
    return await Interest.query(await ctx.trx).whereNotDeleted()
  }

  @Authorized('ADMIN')
  @Mutation(() => Interest, { description: 'Create an interest' })
  async createInterest(
    @Ctx() ctx: TrxContext & UserCtx,
    @Arg('newInterest') newInterest: NewInterestInput
  ): Promise<Interest> {
    const interest = await Interest.query(await ctx.trx).insertAndFetch({
      label: newInterest.label,
      description: newInterest.description,
    })

    return interest
  }

  @Authorized('ADMIN')
  @Mutation(() => Boolean, { description: 'Delete an interest' })
  async deleteInterest(
    @Ctx() ctx: TrxContext & UserCtx,
    @Arg('interestId', () => ID) interestId: string
  ): Promise<boolean> {
    await Interest.query(await ctx.trx).deleteById(interestId)

    return true
  }

  @Authorized('USER')
  @Mutation(() => User, { description: 'Add an interest to user' })
  async addInterest(
    @Ctx() ctx: TrxContext & UserCtx,
    @Arg('interestId', () => ID) interestId: string
  ): Promise<User> {
    const user = await User.query(await ctx.trx)
      .findById(ctx.user!.id)
      .throwIfNotFound()

    const relateTrx = await (await ctx.trx).transaction()
    try {
      await user.$relatedQuery('interests', relateTrx).relate(interestId)
      await relateTrx.commit()
    } catch (error) {
      await relateTrx.rollback()
      // Consume unique violation errors
      if (!(error instanceof UniqueViolationError)) {
        throw error
      }
    }

    return user
  }

  @Authorized('USER')
  @Mutation(() => User, { description: 'Remove an interest to user' })
  async removeInterest(
    @Ctx() ctx: TrxContext & UserCtx,
    @Arg('interestId', () => ID) interestId: string
  ): Promise<User> {
    const user = await User.query(await ctx.trx)
      .findById(ctx.user!.id)
      .throwIfNotFound()

    await user
      .$relatedQuery('interests', await ctx.trx)
      .unrelate()
      .where({ interestId })

    return user
  }
}
