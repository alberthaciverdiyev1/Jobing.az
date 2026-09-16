import { Router } from 'express';
import { flash } from '../Middlewares/Flash.js';
import { currentUser } from '../Modules/User/Middlewares/CurrentUser.js';
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

router.use(flash);
router.use(currentUser);

router.use('/api/v1', apiRouter);
router.use('/', webRouter);
