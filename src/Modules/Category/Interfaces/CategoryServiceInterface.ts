import type { Category } from '../Entities/Category.js';
import type { CategoryListFilters } from './CategoryListFilters.js';
import type { CreateCategoryInput } from './CreateCategoryInput.js';
import type { UpdateCategoryInput } from './UpdateCategoryInput.js';

/** Business contract for categories. Controllers depend on this, not the class. */
export interface CategoryServiceInterface {
  list(filters: CategoryListFilters): Promise<Category[]>;
  getById(id: string): Promise<Category>;
  getBySlug(slug: string): Promise<Category>;
  create(input: CreateCategoryInput): Promise<Category>;
  update(id: string, input: UpdateCategoryInput): Promise<Category>;
  remove(id: string): Promise<void>;
}
