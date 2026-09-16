import { Router } from 'express';
import { apiRouter } from './Api.js';
import { webRouter } from './Web.js';

/**
 * Root router.
 *
 * - `/api/v1/*` -> JSON API
 * - everything else -> server-rendered Handlebars pages
 *
 * Feature modules register themselves in `Api.ts` / `Web.ts`.
 */
export const router = Router();

router.use('/api/v1', apiRouter);
router.use('/', webRouter);
