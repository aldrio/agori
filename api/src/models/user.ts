import StandardModel from './standard-model'
import { Field, ObjectType } from 'type-graphql'

@ObjectType('User')
export default class User extends StandardModel {
  static get tableName() {
    return 'users'
  }

  @Field()
  displayName!: string
}
