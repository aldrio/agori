import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  await knex.schema.table('users', function (table) {
    table.string('bio').nullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.table('users', function (table) {
    table.dropColumn('bio')
  })
}
