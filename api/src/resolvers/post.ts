import {
  Field,
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Int,
  Ctx,
  ID,
  Authorized,
  FieldResolver,
  Root,
  Mutation,
  InputType,
} from 'type-graphql'
import { Min, Max, MinLength, MaxLength } from 'class-validator'
import logger from 'utils/logger'
import { User, Post, Interest } from 'models'
import { TrxContext } from 'server/middleware/transaction'
import { isAdmin, UserCtx } from 'server/create-context'
import { fn, ref } from 'objection'
import { Trim } from 'class-sanitizer'

@InputType()
export class PostQueryInput {
  @Field(() => Int, { nullable: true })
  @Min(0)
  skip: number = 0

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(50)
  take: number = 50

  @Field(() => ID, { nullable: true })
  interestId?: string
}

@ArgsType()
class NewPostInput {
  @Field(() => String)
  @Trim()
  @MinLength(1)
  @MaxLength(5000)
  content!: string
}

@ArgsType()
class EditPostInput {
  @Field(() => String, { nullable: true })
  @Trim()
  @MinLength(1)
  @MaxLength(5000)
  content?: string

  @Field(() => Boolean, { nullable: true })
  delete?: boolean
}

@Resolver(Post)
export default class PostResolver {
  constructor() {}

  @Authorized('USER')
  @Query(() => [Post])
  async posts(
    @Ctx() ctx: TrxContext & UserCtx,
    @Arg('query') query: PostQueryInput
  ): Promise<Post[]> {
    return await Post.query(await ctx.trx)
      .orderBy(ref('createdAt'), 'DESC')
      .where({
        interestId: query.interestId,
      })
      .offset(query.skip)
      .limit(query.take)
  }

  @Authorized('USER')
  @Query(() => User)
  async post(
    @Ctx() ctx: TrxContext & UserCtx,
    @Arg('id', () => ID) id: string
  ): Promise<Post> {
    return await Post.query(await ctx.trx)
      .findById(id)
      .throwIfNotFound()
  }

  @Authorized('USER')
  @FieldResolver(() => Interest)
  async interest(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() post: Post
  ): Promise<Interest> {
    if (post.interest === undefined) {
      await post.$fetchGraph('interest', { transaction: await ctx.trx })
    }

    return post.interest!
  }

  @Authorized('USER')
  @FieldResolver(() => Post, { nullable: true })
  async parentPost(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() post: Post
  ): Promise<Post | null> {
    if (post.parentPost === undefined) {
      await post.$fetchGraph('parentPost', { transaction: await ctx.trx })
    }

    return post.parentPost!
  }

  @Authorized('USER')
  @FieldResolver(() => [Post])
  async childrenPosts(
    @Ctx() ctx: TrxContext & UserCtx,
    @Root() post: Post,
    @Arg('query') query: PostQueryInput
  ): Promise<Post[]> {
    if (post.childrenPosts === undefined) {
      await post
        .$fetchGraph('childrenPosts', { transaction: await ctx.trx })
        .orderBy(ref('createdAt'), 'DESC')
        .offset(query.skip)
        .limit(query.take)
    }

    return post.childrenPosts!
  }

  @Authorized('USER')
  @Mutation(() => Post)
  async createPost(
    @Ctx() ctx: TrxContext & UserCtx,
    @Args() createPost: NewPostInput,
    @Arg('interestId', () => ID, { nullable: true }) interestId?: string,
    @Arg('parentPostId', () => ID, { nullable: true }) parentPostId?: string
  ): Promise<Post> {
    if (!interestId && !parentPostId) {
      throw new Error('must specify one of interestId or parentPostId')
    }

    if (parentPostId) {
      const parent = await Post.query(await ctx.trx).findById(parentPostId)
      interestId = parent.interestId
    }

    logger.info(
      { userId: ctx.user!.id, interestId, parentPostId, createPost },
      'creating post'
    )

    return await Post.query(await ctx.trx).insert({
      ...createPost,
      parentPostId,
      interestId,
      userId: ctx.user!.id,
    })
  }

  @Authorized('USER')
  @Mutation(() => Post)
  async editPost(
    @Ctx() ctx: TrxContext & UserCtx,
    @Args() editPost: EditPostInput,
    @Arg('id', () => ID) id: string
  ): Promise<Post> {
    let editQuery = Post.query(await ctx.trx).patchAndFetchById(id, {
      content: editPost.content,
      deletedAt:
        editPost.delete !== undefined && editPost.delete === true
          ? fn.now()
          : null,
    })

    if (!isAdmin(ctx)) {
      editQuery = editQuery.where({
        userId: ctx.user!.id,
      })
    }

    return await editQuery
  }
}
