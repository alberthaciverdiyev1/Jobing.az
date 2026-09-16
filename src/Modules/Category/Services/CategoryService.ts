import { NotFoundError, ValidationError } from '../../../Core/Http/Errors/index.js';
import { normalizeTranslation } from '../../../Core/Localization/TranslateText.js';
import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';
import { uniqueSlug } from '../../../Core/Support/UniqueSlug.js';
import type { Category } from '../Entities/Category.js';
import type { NewCategory } from '../Entities/NewCategory.js';
import type { CategoryListFilters } from '../Interfaces/CategoryListFilters.js';
import type { CategoryRepositoryInterface } from '../Interfaces/CategoryRepositoryInterface.js';
import type { CategoryServiceInterface } from '../Interfaces/CategoryServiceInterface.js';
import type { CreateCategoryInput } from '../Interfaces/CreateCategoryInput.js';
import type { UpdateCategoryInput } from '../Interfaces/UpdateCategoryInput.js';

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
    const name = normalizeTranslation(input.name);
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
    const name = input.name ? normalizeTranslation(input.name) : existing.name;
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
    name: TranslatedText,
    exceptId?: string,
  ): Promise<string> {
    return uniqueSlug(candidate?.trim() || name.az, (slug) =>
      this.categories.slugExists(slug, exceptId),
    );
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
