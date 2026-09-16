import type { Kysely } from 'kysely';

/**
 * Storage for express-session (connect-pg-simple).
 * Kept in Core because sessions are infrastructure, not a domain concern.
 */
export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('session')
    .addColumn('sid', 'varchar', (col) => col.primaryKey().notNull())
    .addColumn('sess', 'json', (col) => col.notNull())
    .addColumn('expire', 'timestamp(6)', (col) => col.notNull())
    .execute();

  await db.schema.createIndex('IDX_session_expire').on('session').column('expire').execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('session').execute();
}
