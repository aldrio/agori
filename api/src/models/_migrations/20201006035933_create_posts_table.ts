import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('posts', function (table) {
    table.uuid('id').primary().notNullable()
    table.dateTime('created_at').notNullable()
    table.dateTime('updated_at').notNullable()
    table.dateTime('deleted_at')

    table.uuid('user_id').references('id').inTable('users').notNullable()
    table
      .uuid('interest_id')
      .references('id')
      .inTable('interests')
      .notNullable()
    table.uuid('parent_post_id').references('id').inTable('posts').nullable()

    table.string('content').notNullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('posts')
}
