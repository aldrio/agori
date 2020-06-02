import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('users', function (table) {
    table.uuid('id').primary().notNullable()
    table.dateTime('created_at').notNullable()
    table.dateTime('updated_at').notNullable()
    table.dateTime('deleted_at')

    table.string('display_name').notNullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('users')
}
