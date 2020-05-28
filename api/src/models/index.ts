import Knex from 'knex'
import Config from 'utils/config'
import { Model, knexSnakeCaseMappers } from 'objection'

// Init knex and objection
export const knex = Knex({
  ...Config.dbConnection,
  ...knexSnakeCaseMappers(),
})
Model.knex(knex)
