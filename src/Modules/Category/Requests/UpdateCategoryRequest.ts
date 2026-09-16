import { z } from 'zod';
import { nameField, slugField } from './NameField.js';

/** `PATCH /api/v1/categories/:id` — every field is optional. */
export const updateCategoryRequest = z.object({
  name: nameField.optional(),
  slug: slugField.optional(),
  parentId: z.uuid().nullable().optional(),
  position: z.coerce.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequest>;
