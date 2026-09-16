import { z } from 'zod';
import { nameField, slugField } from './NameField.js';

/** `POST /api/v1/categories` */
export const createCategoryRequest = z.object({
  name: nameField,
  slug: slugField.optional(),
  parentId: z.uuid().nullable().optional(),
  position: z.coerce.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

export type CreateCategoryRequest = z.infer<typeof createCategoryRequest>;
