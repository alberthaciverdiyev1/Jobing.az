import { z } from 'zod';

/** Azerbaijani is required; every other locale is optional and falls back to it. */
export const nameField = z.object({
  az: z.string().trim().min(1, 'Azerbaijani name is required').max(255),
  en: z.string().trim().min(1).max(255).optional(),
  ru: z.string().trim().min(1).max(255).optional(),
  tr: z.string().trim().min(1).max(255).optional(),
});

export const slugField = z.string().trim().min(1).max(200);
