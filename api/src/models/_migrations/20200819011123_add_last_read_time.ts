import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  await knex.schema.table('chats_users', function (table) {
    table.dateTime('last_read_time').nullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.table('chats_users', function (table) {
    table.dropColumn('last_read_time')
  })
}
