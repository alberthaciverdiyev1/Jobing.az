import { z } from 'zod';
import { translatedTextSchema } from '../../../Core/Localization/TranslatedTextSchema.js';
import { slugField } from '../../../Core/Support/SlugField.js';

/**
 * `PATCH /api/v1/companies/:id` — the profile fields an owner may change.
 *
 * Verification and premium status are *not* here: the owner must never be able to
 * grant them. They live in `UpdateCompanyStatusRequest`.
 */
export const updateCompanyRequest = z.object({
  name: translatedTextSchema().optional(),
  slug: slugField.optional(),
  description: translatedTextSchema(5000).nullable().optional(),
  cityId: z.uuid().nullable().optional(),
  website: z.string().trim().max(255).nullable().optional(),
  email: z.email().max(255).nullable().optional(),
  phone: z.string().trim().max(50).nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCompanyRequest = z.infer<typeof updateCompanyRequest>;
