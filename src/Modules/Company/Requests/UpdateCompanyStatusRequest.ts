import { z } from 'zod';

/** `PATCH /api/v1/companies/:id/status` — administrators only. */
export const updateCompanyStatusRequest = z.object({
  isVerified: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCompanyStatusRequest = z.infer<typeof updateCompanyStatusRequest>;
