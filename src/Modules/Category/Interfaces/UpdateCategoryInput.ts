import type { CategoryName } from '../Entities/CategoryName.js';

export interface UpdateCategoryInput {
  name?: CategoryName;
  slug?: string;
  parentId?: string | null;
  position?: number;
  isActive?: boolean;
}
