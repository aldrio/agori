import StandardModel from './standard-model'
import { Model } from 'objection'
import path from 'path'
import { User, Interest } from 'models'

export default class InterestUser extends StandardModel {
  static get tableName() {
    return 'interests_users'
  }

  static relationMappings = {
    interest: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'interest'),
      join: {
        from: 'interests_users.interestId',
        to: 'interests.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'user'),
      join: {
        from: 'interests_users.userId',
        to: 'users.id',
      },
    },
  }

  interest?: Interest
  interestId!: string

  user?: User
  userId!: string
}
