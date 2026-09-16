import { integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import type { CompanyMediaKind } from '../Entities/CompanyMediaKind.js';
import { companies } from './CompanyConfiguration.js';

/**
 * Metadata for company images. The bytes themselves live on disk under
 * `public/images/companies/<id>/` and are served by the static middleware, so
 * this table only has to answer "which file, what type, how big".
 */
export const companyMedia = pgTable(
  'company_media',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    kind: varchar('kind', { length: 16 }).$type<CompanyMediaKind>().notNull(),
    /** Path relative to `public/`, e.g. `images/companies/<id>/logo-1a2b3c.png`. */
    path: varchar('path', { length: 512 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    byteSize: integer('byte_size').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('company_media_company_kind_unique').on(table.companyId, table.kind)],
);

export type CompanyMediaRow = typeof companyMedia.$inferSelect;
export type NewCompanyMediaRow = typeof companyMedia.$inferInsert;
