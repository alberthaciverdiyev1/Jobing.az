import { z } from 'zod';

/** An explicit slug. When omitted, the service derives one from the name. */
export const slugField = z.string().trim().min(1).max(200);
