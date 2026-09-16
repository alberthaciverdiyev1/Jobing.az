import type { CategoryName } from '../Entities/CategoryName.js';

/** A category as sent to clients. */
export interface CategoryResource {
  id: string;
  parentId: string | null;
  slug: string;
  /** Resolved for the request locale, falling back to Azerbaijani. */
  name: string;
  /** Every locale that has a value. */
  translations: CategoryName;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
