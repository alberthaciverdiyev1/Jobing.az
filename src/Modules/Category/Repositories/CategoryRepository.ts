import { and, count, eq, isNull, ne, sql } from 'drizzle-orm';
import { getDb } from '../../../Core/Database/index.js';
import { categories } from '../Configurations/CategoryConfiguration.js';
import type { Category } from '../Entities/Category.js';
import type { NewCategory } from '../Entities/NewCategory.js';
import type { CategoryListFilters } from '../Interfaces/CategoryListFilters.js';
import type { CategoryRepositoryInterface } from '../Interfaces/CategoryRepositoryInterface.js';

export class CategoryRepository implements CategoryRepositoryInterface {
  async findById(id: string): Promise<Category | undefined> {
    const [row] = await getDb().select().from(categories).where(eq(categories.id, id)).limit(1);
    return row;
  }

  async findBySlug(slug: string): Promise<Category | undefined> {
    const [row] = await getDb().select().from(categories).where(eq(categories.slug, slug)).limit(1);

    return row;
  }

  async slugExists(slug: string, exceptId?: string): Promise<boolean> {
    const matches = eq(categories.slug, slug);
    const [row] = await getDb()
      .select({ id: categories.id })
      .from(categories)
      .where(exceptId ? and(matches, ne(categories.id, exceptId)) : matches)
      .limit(1);

    return row !== undefined;
  }

  async list(filters: CategoryListFilters): Promise<Category[]> {
    const conditions = [];

    if (filters.parentId === null) {
      conditions.push(isNull(categories.parentId));
    } else if (typeof filters.parentId === 'string') {
      conditions.push(eq(categories.parentId, filters.parentId));
    }

    if (filters.onlyActive) {
      conditions.push(eq(categories.isActive, true));
    }

    if (filters.search) {
      conditions.push(
        sql`lower(${categories.name} ->> 'az') like ${`%${filters.search.toLowerCase()}%`}`,
      );
    }

    return getDb()
      .select()
      .from(categories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(categories.position, categories.slug);
  }

  async countChildren(parentId: string): Promise<number> {
    const [row] = await getDb()
      .select({ total: count() })
      .from(categories)
      .where(eq(categories.parentId, parentId));

    return row?.total ?? 0;
  }

  async create(data: NewCategory): Promise<Category> {
    const [row] = await getDb().insert(categories).values(data).returning();
    if (!row) throw new Error('Insert did not return the created category');
    return row;
  }

  async update(id: string, data: Partial<NewCategory>): Promise<Category | undefined> {
    const [row] = await getDb()
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    return row;
  }

  async delete(id: string): Promise<boolean> {
    const removed = await getDb()
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });

    return removed.length > 0;
  }
}
