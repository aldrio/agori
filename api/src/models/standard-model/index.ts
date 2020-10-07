import { Model, Page, QueryBuilder } from 'objection'
import { v4 as uuid } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import { Field, ID, ObjectType } from 'type-graphql'

export class StandardQueryBuilder<
  M extends Model,
  R = M[]
> extends QueryBuilder<M, R> {
  ArrayQueryBuilderType!: StandardQueryBuilder<M, M[]>
  SingleQueryBuilderType!: StandardQueryBuilder<M, M>
  NumberQueryBuilderType!: StandardQueryBuilder<M, number>
  PageQueryBuilderType!: StandardQueryBuilder<M, Page<M>>

  delete() {
    this.context({
      softDelete: true,
    })
    return this.patch({
      deletedAt: new Date(),
    } as any)
  }

  undelete() {
    this.context({
      undelete: true,
    })
    return this.patch({
      deletedAt: null,
    } as any)
  }

  hardDelete() {
    return super.delete()
  }

  whereNotDeleted() {
    return this.whereNull('deletedAt')
  }

  whereDeleted() {
    return this.whereNotNull('deletedAt')
  }
}

@ObjectType({ isAbstract: true })
export default abstract class StandardModel extends Model {
  QueryBuilderType!: StandardQueryBuilder<this>
  static QueryBuilder = StandardQueryBuilder

  static get modifiers() {
    return {
      ...super.modifiers,
      notDeleted: (qb: any) => qb.whereNotDeleted(),
      deleted: (qb: any) => qb.whereDeleted(),
    }
  }

  $beforeInsert() {
    if (!this.id) {
      this.id = uuid()
    }
    const now = dayjs()
    this.createdAt = now
    this.updatedAt = now
  }

  $beforeUpdate() {
    this.updatedAt = dayjs()
  }

  @Field((type) => ID)
  id!: string

  @Field((type) => Date)
  createdAt!: Dayjs

  @Field((type) => Date)
  updatedAt!: Dayjs

  @Field((type) => Date, { nullable: true })
  deletedAt?: Dayjs | null
}
