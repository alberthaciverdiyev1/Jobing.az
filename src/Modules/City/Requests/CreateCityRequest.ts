import { z } from 'zod';
import { translatedTextSchema } from '../../../Core/Localization/TranslatedTextSchema.js';
import { slugField } from '../../../Core/Support/SlugField.js';

/** `POST /api/v1/cities` */
export const createCityRequest = z.object({
  name: translatedTextSchema(),
  slug: slugField.optional(),
  position: z.coerce.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

export type CreateCityRequest = z.infer<typeof createCityRequest>;
