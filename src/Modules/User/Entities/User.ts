import type { NewUserRow, UserRow } from '../Configurations/UserConfiguration.js';

/**
 * An account exactly as stored in the `users` table.
 *
 * The row type comes straight from the Drizzle configuration, so the entity can
 * never drift from the schema and no hand-written row mapper is needed.
 */
export type User = UserRow;

/** The fields accepted when creating an account. */
export type NewUser = NewUserRow;

export type { NewUserRow, UserRow };
