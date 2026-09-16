import type { ColumnType, Generated } from 'kysely';

/**
 * Shape of the database as seen by Kysely.
 * Keep this in sync with the files in `Migrations/` — Kysely trusts it blindly.
 */

/** `timestamptz` that the database fills in for us. */
type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>;

export interface UsersTable {
  id: Generated<string>;
  email: string;
  passwordHash: string;
  name: string;
  isAdmin: Generated<boolean>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Database {
  users: UsersTable;
}
