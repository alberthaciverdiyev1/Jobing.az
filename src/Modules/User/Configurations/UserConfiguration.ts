import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

/**
 * Accounts for every role (job seeker, company owner, admin).
 *
 * This file *is* the entity configuration: `drizzle-kit generate` diffs it
 * against the previous snapshot and writes the migration SQL, exactly like an
 * EF Core entity configuration feeding `AppDbContext`.
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** A row as returned by a select. */
export type UserRow = typeof users.$inferSelect;
/** The shape accepted by an insert. */
export type NewUserRow = typeof users.$inferInsert;
