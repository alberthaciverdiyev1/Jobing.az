import { Router, type Router as ExpressRouter } from 'express';
import { buildModuleRouters } from '../Core/Provider/ModuleProvider.js';
import { csrfProtection } from '../Middlewares/Csrf.js';
import { flash } from '../Middlewares/Flash.js';
import { currentUser } from '../Modules/User/Middlewares/CurrentUser.js';

/** Everything the JSON API lives under. */
export const API_PREFIX = '/api/v1';

/**
 * Builds the root router.
 *
 * Modules are **not** listed here — `Core/Provider` discovers every
 * `Modules/<Name>/Routes/{Web,Api}.ts` on disk and mounts it at its `basePath`.
 *
 * Only cross-cutting middlewares are wired by hand, and they must run before the
 * module routers.
 */
export async function createRootRouter(): Promise<ExpressRouter> {
  const router = Router();

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
