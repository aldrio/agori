import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  await knex.schema.table('users', function (table) {
    table.string('avatar_data', 1000).nullable()
    table.string('avatar_thumbnail_url').nullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.table('users', function (table) {
    table.dropColumn('avatar_data')
    table.dropColumn('avatar_thumbnail_url')
  })
}
