import { ConflictError, NotFoundError, ValidationError } from '../../../Core/Http/Errors/index.js';
import { slugify } from '../../../Core/Support/Slugify.js';
import type { Category } from '../Entities/Category.js';
import type { CategoryName } from '../Entities/CategoryName.js';
import type { NewCategory } from '../Entities/NewCategory.js';
import type { CategoryListFilters } from '../Interfaces/CategoryListFilters.js';
import type { CategoryRepositoryInterface } from '../Interfaces/CategoryRepositoryInterface.js';
import type { CategoryServiceInterface } from '../Interfaces/CategoryServiceInterface.js';
import type { CreateCategoryInput } from '../Interfaces/CreateCategoryInput.js';
import type { UpdateCategoryInput } from '../Interfaces/UpdateCategoryInput.js';

const MAX_SLUG_ATTEMPTS = 50;
const SECONDARY_LOCALES = ['en', 'ru', 'tr'] as const;

/** Trims every locale and drops the empty ones so fallback works predictably. */
function normalizeName(name: CategoryName): CategoryName {
  const normalized: CategoryName = { az: name.az.trim() };

  for (const locale of SECONDARY_LOCALES) {
    const value = name[locale];
    if (typeof value === 'string' && value.trim().length > 0) {
      normalized[locale] = value.trim();
    }
  }

  return normalized;
}

/**
 * Business rules for categories: unique slugs, a valid parent, and no cycles.
 */
export class CategoryService implements CategoryServiceInterface {
  constructor(private readonly categories: CategoryRepositoryInterface) {}

  async list(filters: CategoryListFilters): Promise<Category[]> {
    return this.categories.list(filters);
  }

  async getById(id: string): Promise<Category> {
    const found = await this.categories.findById(id);
    if (!found) throw new NotFoundError('Category not found');
    return found;
  }

  async getBySlug(slug: string): Promise<Category> {
    const found = await this.categories.findBySlug(slug);
    if (!found) throw new NotFoundError('Category not found');
    return found;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const name = normalizeName(input.name);
    await this.assertParentIsUsable(input.parentId ?? null, null);

    return this.categories.create({
      slug: await this.freeSlug(input.slug, name),
      name,
      parentId: input.parentId ?? null,
      position: input.position ?? 0,
      isActive: input.isActive ?? true,
    });
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const existing = await this.getById(id);
    const name = input.name ? normalizeName(input.name) : existing.name;
    const changes: Partial<NewCategory> = {};

    if (input.name) changes.name = name;

    if (input.slug !== undefined) {
      changes.slug = await this.freeSlug(input.slug, name, id);
    }

    if (input.parentId !== undefined) {
      await this.assertParentIsUsable(input.parentId, id);
      changes.parentId = input.parentId;
    }

    if (input.position !== undefined) changes.position = input.position;
    if (input.isActive !== undefined) changes.isActive = input.isActive;

    const updated = await this.categories.update(id, changes);
    if (!updated) throw new NotFoundError('Category not found');

    return updated;
  }

  /** Children disappear through the foreign key's ON DELETE CASCADE. */
  async remove(id: string): Promise<void> {
    const removed = await this.categories.delete(id);
    if (!removed) throw new NotFoundError('Category not found');
  }

  private async freeSlug(
    candidate: string | undefined,
    name: CategoryName,
    exceptId?: string,
  ): Promise<string> {
    const base = slugify(candidate?.trim() || name.az);

    if (base.length === 0) {
      throw new ValidationError('Could not build a slug from the name — provide one explicitly');
    }

    if (!(await this.categories.slugExists(base, exceptId))) return base;

    for (let suffix = 2; suffix <= MAX_SLUG_ATTEMPTS; suffix += 1) {
      const withSuffix = `${base}-${suffix}`;
      if (!(await this.categories.slugExists(withSuffix, exceptId))) return withSuffix;
    }

    throw new ConflictError(`Could not find a free slug for "${base}"`);
  }

  /** Rejects a missing parent, a self-parent and any move that would make a cycle. */
  private async assertParentIsUsable(
    parentId: string | null,
    selfId: string | null,
  ): Promise<void> {
    if (parentId === null) return;

    if (parentId === selfId) {
      throw new ValidationError('A category cannot be its own parent');
    }

    if (!(await this.categories.findById(parentId))) {
      throw new ValidationError('The parent category does not exist');
    }

    if (selfId && (await this.isDescendantOf(parentId, selfId))) {
      throw new ValidationError('That category is inside this one');
    }
  }

  /** Walks up from `candidateId` looking for `ancestorId`. */
  private async isDescendantOf(candidateId: string, ancestorId: string): Promise<boolean> {
    const visited = new Set<string>();
    let current: string | null = candidateId;

    while (current !== null && !visited.has(current)) {
      if (current === ancestorId) return true;

      visited.add(current);
      const node = await this.categories.findById(current);
      current = node?.parentId ?? null;
    }

    return false;
  }
}
