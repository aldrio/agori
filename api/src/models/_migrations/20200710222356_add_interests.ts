import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
  await knex.schema.createTable('interests', function (table) {
    table.uuid('id').primary().notNullable()
    table.dateTime('created_at').notNullable()
    table.dateTime('updated_at').notNullable()
    table.dateTime('deleted_at')

    table.string('label').notNullable()
    table.string('description').notNullable()
  })
  await knex.schema.createTable('interests_users', function (table) {
    table
      .uuid('id')
      .primary()
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now())
    table.dateTime('deleted_at')

    table
      .uuid('interest_id')
      .references('id')
      .inTable('interests')
      .notNullable()
    table.uuid('user_id').references('id').inTable('users').notNullable()

    table.unique(['interest_id', 'user_id'])
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('interests_users')
  await knex.schema.dropTable('interests')
}
