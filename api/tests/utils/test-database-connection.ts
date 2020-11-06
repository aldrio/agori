import { knex } from 'models'
import knexCleaner from 'knex-cleaner'

export default {
  /**
   * Sets up database
   */
  initDatabase: async (): Promise<void> => {
    await knex.migrate.latest()
  },

  /**
   * Destroys database
   */
  destroyDatabase: async (): Promise<void> => {
    await knex.migrate.rollback()
    await knex.destroy()
  },

  /**
   * Removes everything in the database
   */
  cleanDatabase: async (): Promise<void> => {
    await knexCleaner.clean(knex, {
      ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
    })
  },
}
