import type { ColumnType, Generated } from 'kysely';

/**
 * Shape of the database as seen by Kysely.
 * Property names are camelCase; the CamelCasePlugin maps them to snake_case
 * columns, so this file must stay in sync with the migrations.
 */

/** `timestamptz` that the database fills in for us. */
export type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>;

export interface UsersTable {
  id: Generated<string>;
  email: string;
  passwordHash: string;
  name: string;
  isAdmin: Generated<boolean>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** connect-pg-simple's storage table. */
export interface SessionsTable {
  sid: string;
  sess: unknown;
  expire: Date;
}

export interface Database {
  users: UsersTable;
  session: SessionsTable;
}
