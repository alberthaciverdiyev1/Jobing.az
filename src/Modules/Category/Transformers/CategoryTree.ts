import type { CategoryResource } from './CategoryResource.js';
import type { CategoryTreeNode } from './CategoryTreeNode.js';

/**
 * Nests a flat list. Orphans (a child whose parent is filtered out) are treated
 * as roots so nothing silently disappears from the page.
 */
export function buildCategoryTree(categories: CategoryResource[]): CategoryTreeNode[] {
  const nodes = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  for (const category of categories) {
    nodes.set(category.id, { ...category, children: [] });
  }

  for (const category of categories) {
    const node = nodes.get(category.id);
    if (!node) continue;

    const parent = category.parentId === null ? undefined : nodes.get(category.parentId);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/** Depth-first search for one node inside a built tree. */
export function findCategorySubtree(
  tree: CategoryTreeNode[],
  id: string,
): CategoryTreeNode | undefined {
  for (const node of tree) {
    if (node.id === id) return node;

    const nested = findCategorySubtree(node.children, id);
    if (nested) return nested;
  }

  return undefined;
}
