import { translateText } from '../../../Core/Localization/TranslateText.js';
import type { Category } from '../Entities/Category.js';
import type { CategoryResource } from './CategoryResource.js';

export function transformCategory(category: Category, locale: string): CategoryResource {
  return {
    id: category.id,
    parentId: category.parentId ?? null,
    slug: category.slug,
    name: translateText(category.name, locale),
    translations: category.name,
    position: category.position,
    isActive: category.isActive,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function transformCategories(categories: Category[], locale: string): CategoryResource[] {
  return categories.map((category) => transformCategory(category, locale));
}
