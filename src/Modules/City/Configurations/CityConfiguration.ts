import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';

/** Cities and regions vacancies can be located in. */
export const cities = pgTable(
  'cities',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    name: jsonb('name').$type<TranslatedText>().notNull(),
    position: integer('position').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_cities_position').on(table.position)],
);

export type CityRow = typeof cities.$inferSelect;
export type NewCityRow = typeof cities.$inferInsert;
