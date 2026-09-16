import { z } from 'zod';
import { translatedTextSchema } from '../../../Core/Localization/TranslatedTextSchema.js';
import { slugField } from '../../../Core/Support/SlugField.js';

/** `PATCH /api/v1/categories/:id` — every field is optional. */
export const updateCategoryRequest = z.object({
  name: translatedTextSchema().optional(),
  slug: slugField.optional(),
  parentId: z.uuid().nullable().optional(),
  position: z.coerce.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequest>;
