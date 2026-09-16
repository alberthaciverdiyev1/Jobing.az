import { z } from 'zod';
import { translatedTextSchema } from '../../../Core/Localization/TranslatedTextSchema.js';
import { slugField } from '../../../Core/Support/SlugField.js';

/** `POST /api/v1/companies` — the caller becomes the owner. */
export const createCompanyRequest = z.object({
  name: translatedTextSchema(),
  slug: slugField.optional(),
  description: translatedTextSchema(5000).optional(),
  cityId: z.uuid().nullable().optional(),
  website: z.string().trim().max(255).optional(),
  email: z.email().max(255).optional(),
  phone: z.string().trim().max(50).optional(),
});

export type CreateCompanyRequest = z.infer<typeof createCompanyRequest>;
