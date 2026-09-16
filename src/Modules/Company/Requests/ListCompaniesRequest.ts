import { z } from 'zod';

/** `GET /api/v1/companies` */
export const listCompaniesRequest = z.object({
  active: z.enum(['true', 'false']).optional(),
  verified: z.enum(['true', 'false']).optional(),
  cityId: z.uuid().optional(),
  search: z.string().trim().min(1).max(100).optional(),
});

export type ListCompaniesRequest = z.infer<typeof listCompaniesRequest>;
