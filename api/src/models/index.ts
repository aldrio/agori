import pg from 'pg'
import Knex from 'knex'
import Config from 'utils/config'
import { Model, knexSnakeCaseMappers } from 'objection'
import dayjs, { Dayjs } from 'dayjs'

// Add pg type parsers
const parseDate = (val: string | null): Dayjs | null =>
  val === null ? null : dayjs(val)

pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, parseDate)
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, parseDate)
pg.types.setTypeParser(pg.types.builtins.DATE, parseDate)

// Init knex and objection
export const knex = Knex({
  ...Config.dbConnection,
  ...knexSnakeCaseMappers(),
})
Model.knex(knex)

export { default as User } from './user'
export { default as Chat } from './chat'
export { default as ChatUser } from './chat-user'
export { default as Message } from './message'
export { default as Interest } from './interest'
export { default as InterestUser } from './interest-user'
