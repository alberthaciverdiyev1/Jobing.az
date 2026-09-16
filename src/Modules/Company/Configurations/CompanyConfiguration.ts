import {
  boolean,
  index,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';
import { cities } from '../../City/Configurations/CityConfiguration.js';
import { users } from '../../User/Configurations/UserConfiguration.js';

/**
 * Company profiles.
 *
 * Logos and banners deliberately live in `company_media` instead of here: a
 * `select()` without an explicit column list would otherwise drag the binary
 * data into every listing query.
 */
export const companies = pgTable(
  'companies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** The account that manages the page. A user owns at most one company. */
    ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'set null' }),
    cityId: uuid('city_id').references(() => cities.id, { onDelete: 'set null' }),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    name: jsonb('name').$type<TranslatedText>().notNull(),
    description: jsonb('description').$type<TranslatedText>(),
    website: varchar('website', { length: 255 }),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    isVerified: boolean('is_verified').notNull().default(false),
    isPremium: boolean('is_premium').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Postgres allows several NULLs, so unowned companies remain possible.
    uniqueIndex('companies_owner_id_unique').on(table.ownerId),
    index('idx_companies_city').on(table.cityId),
  ],
);

export type CompanyRow = typeof companies.$inferSelect;
export type NewCompanyRow = typeof companies.$inferInsert;
