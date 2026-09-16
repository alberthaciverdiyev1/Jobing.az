import type { Category } from '../Entities/Category.js';
import type { CategoryName } from '../Entities/CategoryName.js';
import type { CategoryResource } from './CategoryResource.js';

/** Supported secondary locales, mapped to their key on the name object. */
const SECONDARY_LOCALES: Record<string, keyof CategoryName> = {
  en: 'en',
  ru: 'ru',
  tr: 'tr',
};

/** Picks the locale's name, falling back to the primary one. */
function localizedName(category: Category, locale: string): string {
  const key = SECONDARY_LOCALES[locale];
  return (key ? category.name[key] : undefined) ?? category.name.az;
}

export function transformCategory(category: Category, locale: string): CategoryResource {
  return {
    id: category.id,
    parentId: category.parentId ?? null,
    slug: category.slug,
    name: localizedName(category, locale),
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
