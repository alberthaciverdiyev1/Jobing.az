import { z } from 'zod';
import { translatedTextSchema } from '../../../Core/Localization/TranslatedTextSchema.js';
import { slugField } from '../../../Core/Support/SlugField.js';

/** `PATCH /api/v1/cities/:id` — every field is optional. */
export const updateCityRequest = z.object({
  name: translatedTextSchema().optional(),
  slug: slugField.optional(),
  position: z.coerce.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCityRequest = z.infer<typeof updateCityRequest>;
