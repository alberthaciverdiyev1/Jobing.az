import { Router, type Router as ExpressRouter } from 'express';
import { csrfProtection } from '../../Middlewares/Csrf.js';
import { flash } from '../../Middlewares/Flash.js';
import { currentUser } from '../../Modules/User/Middlewares/CurrentUser.js';
import { buildModuleRouters } from '../Provider/ModuleProvider.js';

/** Everything the JSON API lives under. */
const API_PREFIX = '/api/v1';

/**
 * Assembles the root router.
 *
 * No module is named here: `Core/Provider` discovers every
 * `Modules/<Name>/Routes/{Web,Api}.ts` and mounts it at its `basePath`. Only the
 * cross-cutting middlewares and the two mount points are wired by hand.
 */
export async function createRootRouter(): Promise<ExpressRouter> {
  const router = Router();

  // Must run before any module router.
  router.use(flash);
  router.use(currentUser);

  const { web, api } = await buildModuleRouters();

  router.use(API_PREFIX, api);

  // Pages are form-driven, so every web route sits behind CSRF protection.
  // The JSON API relies on the SameSite=Lax session cookie instead.
  const pages = Router();
  pages.use(csrfProtection);
  pages.use(web);
  router.use('/', pages);

  return router;
}
