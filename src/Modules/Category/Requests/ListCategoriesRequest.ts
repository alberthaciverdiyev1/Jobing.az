import { z } from 'zod';

/** `GET /api/v1/categories` — `parentId=root` asks for top-level categories. */
export const listCategoriesRequest = z.object({
  parentId: z.union([z.uuid(), z.literal('root')]).optional(),
  active: z.enum(['true', 'false']).optional(),
  search: z.string().trim().min(1).max(100).optional(),
  tree: z.enum(['true', 'false']).optional(),
});

export type ListCategoriesRequest = z.infer<typeof listCategoriesRequest>;
