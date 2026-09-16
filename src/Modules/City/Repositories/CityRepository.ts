import { and, eq, ne, sql } from 'drizzle-orm';
import { getDb } from '../../../Core/Database/index.js';
import { cities } from '../Configurations/CityConfiguration.js';
import type { City } from '../Entities/City.js';
import type { NewCity } from '../Entities/NewCity.js';
/** Filters accepted when listing cities. */
export interface CityListFilters {
  onlyActive?: boolean;
  /** Case-insensitive match against the primary locale name. */
  search?: string;
}

export class CityRepository {
  async findById(id: string): Promise<City | undefined> {
    const [row] = await getDb().select().from(cities).where(eq(cities.id, id)).limit(1);
    return row;
  }

  async findBySlug(slug: string): Promise<City | undefined> {
    const [row] = await getDb().select().from(cities).where(eq(cities.slug, slug)).limit(1);
    return row;
  }

  async slugExists(slug: string, exceptId?: string): Promise<boolean> {
    const matches = eq(cities.slug, slug);
    const [row] = await getDb()
      .select({ id: cities.id })
      .from(cities)
      .where(exceptId ? and(matches, ne(cities.id, exceptId)) : matches)
      .limit(1);

    return row !== undefined;
  }

  async list(filters: CityListFilters): Promise<City[]> {
    const conditions = [];

    if (filters.onlyActive) {
      conditions.push(eq(cities.isActive, true));
    }

    if (filters.search) {
      conditions.push(
        sql`lower(${cities.name} ->> 'az') like ${`%${filters.search.toLowerCase()}%`}`,
      );
    }

    return getDb()
      .select()
      .from(cities)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(cities.position, cities.slug);
  }

  async create(data: NewCity): Promise<City> {
    const [row] = await getDb().insert(cities).values(data).returning();
    if (!row) throw new Error('Insert did not return the created city');
    return row;
  }

  async update(id: string, data: Partial<NewCity>): Promise<City | undefined> {
    const [row] = await getDb()
      .update(cities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cities.id, id))
      .returning();

    return row;
  }

  async delete(id: string): Promise<boolean> {
    const removed = await getDb()
      .delete(cities)
      .where(eq(cities.id, id))
      .returning({ id: cities.id });

    return removed.length > 0;
  }
}
