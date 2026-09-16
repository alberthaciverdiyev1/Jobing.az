import type { Category } from '../Entities/Category.js';
import type { NewCategory } from '../Entities/NewCategory.js';
import type { CategoryListFilters } from './CategoryListFilters.js';

/** Persistence contract for categories. */
export interface CategoryRepositoryInterface {
  findById(id: string): Promise<Category | undefined>;
  findBySlug(slug: string): Promise<Category | undefined>;
  slugExists(slug: string, exceptId?: string): Promise<boolean>;
  list(filters: CategoryListFilters): Promise<Category[]>;
  countChildren(parentId: string): Promise<number>;
  create(data: NewCategory): Promise<Category>;
  update(id: string, data: Partial<NewCategory>): Promise<Category | undefined>;
  delete(id: string): Promise<boolean>;
}
