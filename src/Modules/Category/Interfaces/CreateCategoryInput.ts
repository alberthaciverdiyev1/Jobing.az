import type { CategoryName } from '../Entities/CategoryName.js';

export interface CreateCategoryInput {
  name: CategoryName;
  /** Defaults to a slug built from the `az` name. */
  slug?: string;
  parentId?: string | null;
  position?: number;
  isActive?: boolean;
}
