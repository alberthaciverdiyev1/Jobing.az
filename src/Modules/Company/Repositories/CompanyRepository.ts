import { and, eq, inArray, ne, sql } from 'drizzle-orm';
import { getDb } from '../../../Core/Database/index.js';
import { normalizeSearch } from '../../../Core/Support/NormalizeSearch.js';
import { companies } from '../Configurations/CompanyConfiguration.js';
import { companyMedia } from '../Configurations/CompanyMediaConfiguration.js';
import type { Company } from '../Entities/Company.js';
import type { CompanyMedia } from '../Entities/CompanyMedia.js';
import type { CompanyMediaKind } from '../Entities/CompanyMediaKind.js';
import type { NewCompany } from '../Entities/NewCompany.js';

/** Filters accepted when listing companies. */
export interface CompanyListFilters {
  onlyActive?: boolean;
  cityId?: string;
  ownerId?: string;
  isVerified?: boolean;
  search?: string;
}

/** Media metadata — the bytes live on disk, not here. */
export interface CompanyMediaInfo {
  kind: CompanyMediaKind;
  path: string;
  mimeType: string;
  byteSize: number;
  updatedAt: Date;
}

/** What `storeImage` hands back, ready to be recorded. */
export interface StoredImage {
  path: string;
  mimeType: string;
  byteSize: number;
}

export class CompanyRepository {
  async findById(id: string): Promise<Company | undefined> {
    const [row] = await getDb().select().from(companies).where(eq(companies.id, id)).limit(1);
    return row;
  }

  async findBySlug(slug: string): Promise<Company | undefined> {
    const [row] = await getDb().select().from(companies).where(eq(companies.slug, slug)).limit(1);
    return row;
  }

  async findByOwnerId(ownerId: string): Promise<Company | undefined> {
    const [row] = await getDb()
      .select()
      .from(companies)
      .where(eq(companies.ownerId, ownerId))
      .limit(1);

    return row;
  }

  async slugExists(slug: string, exceptId?: string): Promise<boolean> {
    const matches = eq(companies.slug, slug);
    const [row] = await getDb()
      .select({ id: companies.id })
      .from(companies)
      .where(exceptId ? and(matches, ne(companies.id, exceptId)) : matches)
      .limit(1);

    return row !== undefined;
  }

  async list(filters: CompanyListFilters): Promise<Company[]> {
    const conditions = [];

    if (filters.onlyActive) conditions.push(eq(companies.isActive, true));
    if (filters.cityId) conditions.push(eq(companies.cityId, filters.cityId));
    if (filters.ownerId) conditions.push(eq(companies.ownerId, filters.ownerId));
    if (filters.isVerified) conditions.push(eq(companies.isVerified, true));

    if (filters.search) {
      conditions.push(
        sql`lower(${companies.name} ->> 'az') like ${`%${normalizeSearch(filters.search)}%`}`,
      );
    }

    return (
      getDb()
        .select()
        .from(companies)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        // Premium companies surface first, then the most recent ones.
        .orderBy(sql`${companies.isPremium} desc`, companies.createdAt)
    );
  }

  async create(data: NewCompany): Promise<Company> {
    const [row] = await getDb().insert(companies).values(data).returning();
    if (!row) throw new Error('Insert did not return the created company');
    return row;
  }

  async update(id: string, data: Partial<NewCompany>): Promise<Company | undefined> {
    const [row] = await getDb()
      .update(companies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();

    return row;
  }

  async delete(id: string): Promise<boolean> {
    const removed = await getDb()
      .delete(companies)
      .where(eq(companies.id, id))
      .returning({ id: companies.id });

    return removed.length > 0;
  }

  async listMedia(companyId: string): Promise<CompanyMediaInfo[]> {
    return getDb()
      .select({
        kind: companyMedia.kind,
        path: companyMedia.path,
        mimeType: companyMedia.mimeType,
        byteSize: companyMedia.byteSize,
        updatedAt: companyMedia.updatedAt,
      })
      .from(companyMedia)
      .where(eq(companyMedia.companyId, companyId));
  }

  /**
   * Media for many companies in one query, keyed by company id.
   * Keeps listings from issuing a query per row.
   */
  async listMediaForCompanies(companyIds: string[]): Promise<Map<string, CompanyMediaInfo[]>> {
    const grouped = new Map<string, CompanyMediaInfo[]>();
    if (companyIds.length === 0) return grouped;

    const rows = await getDb()
      .select({
        companyId: companyMedia.companyId,
        kind: companyMedia.kind,
        path: companyMedia.path,
        mimeType: companyMedia.mimeType,
        byteSize: companyMedia.byteSize,
        updatedAt: companyMedia.updatedAt,
      })
      .from(companyMedia)
      .where(inArray(companyMedia.companyId, companyIds));

    for (const row of rows) {
      const entries = grouped.get(row.companyId) ?? [];
      entries.push({
        kind: row.kind,
        path: row.path,
        mimeType: row.mimeType,
        byteSize: row.byteSize,
        updatedAt: row.updatedAt,
      });
      grouped.set(row.companyId, entries);
    }

    return grouped;
  }

  async findMedia(companyId: string, kind: CompanyMediaKind): Promise<CompanyMedia | undefined> {
    const [row] = await getDb()
      .select()
      .from(companyMedia)
      .where(and(eq(companyMedia.companyId, companyId), eq(companyMedia.kind, kind)))
      .limit(1);

    return row;
  }

  async upsertMedia(companyId: string, kind: CompanyMediaKind, image: StoredImage): Promise<void> {
    await getDb()
      .insert(companyMedia)
      .values({
        companyId,
        kind,
        path: image.path,
        mimeType: image.mimeType,
        byteSize: image.byteSize,
      })
      .onConflictDoUpdate({
        target: [companyMedia.companyId, companyMedia.kind],
        set: {
          path: image.path,
          mimeType: image.mimeType,
          byteSize: image.byteSize,
          updatedAt: new Date(),
        },
      });
  }

  async deleteMedia(companyId: string, kind: CompanyMediaKind): Promise<boolean> {
    const removed = await getDb()
      .delete(companyMedia)
      .where(and(eq(companyMedia.companyId, companyId), eq(companyMedia.kind, kind)))
      .returning({ id: companyMedia.id });

    return removed.length > 0;
  }
}
