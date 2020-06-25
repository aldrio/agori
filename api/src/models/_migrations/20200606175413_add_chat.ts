import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
  await knex.schema.createTable('chats', function (table) {
    table.uuid('id').primary().notNullable()
    table.dateTime('created_at').notNullable()
    table.dateTime('updated_at').notNullable()
    table.dateTime('deleted_at')

    table.boolean('private').notNullable().defaultTo(true)
    table.string('display_name').nullable()
    table.string('description').nullable()
  })
  await knex.schema.createTable('chats_users', function (table) {
    table
      .uuid('id')
      .primary()
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now())
    table.dateTime('deleted_at')

    table.uuid('chat_id').references('id').inTable('chats').notNullable()
    table.uuid('user_id').references('id').inTable('users').notNullable()

    table.unique(['chat_id', 'user_id'])
  })
  await knex.schema.createTable('messages', function (table) {
    table.uuid('id').primary().notNullable()
    table.dateTime('created_at').notNullable()
    table.dateTime('updated_at').notNullable()
    table.dateTime('deleted_at')

    table
      .uuid('chat_user_id')
      .references('id')
      .inTable('chats_users')
      .notNullable()
    table.string('content').notNullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('messages')
  await knex.schema.dropTable('chats_users')
  await knex.schema.dropTable('chats')
}
