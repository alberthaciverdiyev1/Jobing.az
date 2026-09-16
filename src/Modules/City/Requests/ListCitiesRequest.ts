import { z } from 'zod';

/** `GET /api/v1/cities` */
export const listCitiesRequest = z.object({
  active: z.enum(['true', 'false']).optional(),
  search: z.string().trim().min(1).max(100).optional(),
});

export type ListCitiesRequest = z.infer<typeof listCitiesRequest>;
