import type { CategoryResource } from './CategoryResource.js';

/** A category with its children nested underneath. */
export interface CategoryTreeNode extends CategoryResource {
  children: CategoryTreeNode[];
}
