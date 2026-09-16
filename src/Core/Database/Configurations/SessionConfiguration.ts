import { index, json, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

/** Storage for express-session (connect-pg-simple). Infrastructure, not domain. */
export const session = pgTable(
  'session',
  {
    sid: varchar('sid').primaryKey(),
    sess: json('sess').notNull(),
    expire: timestamp('expire', { withTimezone: true }).notNull(),
  },
  (table) => [index('idx_session_expire').on(table.expire)],
);
