import { Router } from 'express';
import { apiRouter } from './Api.js';
import { webRouter } from './Web.js';

/**
 * Root router.
 *
 * - `/api/v1/*` -> JSON API
 * - everything else -> server-rendered Handlebars pages
 *
 * Module routers are registered in `Api.ts` / `Web.ts`. Every module owns its
 * routes in `Modules/<Name>/Routes/{Web,Api}.ts` and exports `basePath` + `router`.
 */
export const router = Router();

router.use('/api/v1', apiRouter);
router.use('/', webRouter);
