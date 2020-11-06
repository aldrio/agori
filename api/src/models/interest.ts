import StandardModel from './standard-model'
import { Model } from 'objection'
import { Field, ObjectType } from 'type-graphql'
import path from 'path'
import { InterestUser, User } from 'models'

@ObjectType('Interest')
export default class Interest extends StandardModel {
  static get tableName() {
    return 'interests'
  }

  static relationMappings = {
    interestUsers: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'interest-user'),
      join: {
        from: 'interests.id',
        to: 'interests_users.interestId',
      },
    },
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, 'user'),
      join: {
        from: 'interests.id',
        through: {
          from: 'interests_users.interestId',
          to: 'interests_users.userId',
        },
        to: 'users.id',
      },
    },
  }

  interestUsers?: InterestUser[]

  users?: User[]

  @Field(() => Boolean)
  private!: boolean

  @Field(() => String)
  label!: string

  @Field(() => String)
  description!: string
}
