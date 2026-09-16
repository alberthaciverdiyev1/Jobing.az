import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Router, type Router as ExpressRouter } from 'express';
import { logger } from '../Logger.js';
import { discoverModules, type DiscoveredModule } from './ModuleDiscovery.js';

/** A module's route file contract. */
export interface ModuleRoutes {
  /** Mount point, always starting with `/`. */
  basePath: string;
  /** The Express router to mount. */
  router: ExpressRouter;
  /**
   * Registration order; lower wins. Defaults to 100.
   * Only needed when a module owns broad patterns (e.g. `/:slug`) and must be
   * matched after more specific routes.
   */
  order?: number;
}

const DEFAULT_ORDER = 100;

function isRouter(value: unknown): value is ExpressRouter {
  return (
    typeof value === 'function' &&
    'handle' in value &&
    typeof (value as { handle: unknown }).handle === 'function'
  );
}

interface LoadedRoutes {
  moduleName: string;
  basePath: string;
  router: ExpressRouter;
  order: number;
}

async function loadRoutes(
  module: DiscoveredModule,
  file: string,
  kind: RouteKind,
): Promise<LoadedRoutes> {
  const fileName = path.basename(file);
  const loaded = (await import(pathToFileURL(file).href)) as Record<string, unknown>;

  const { basePath, router, order } = loaded;

  if (!isRouter(router)) {
    throw new Error(`${module.name}/Routes/${fileName}: must export an Express router as "router"`);
  }

  if (typeof basePath !== 'string' || !basePath.startsWith('/')) {
    throw new Error(`${module.name}/Routes/${fileName}: must export "basePath" starting with "/"`);
  }

  logger.debug({ module: module.name, kind, basePath }, 'Registered module routes');

  return {
    moduleName: module.name,
    basePath,
    router,
    order: typeof order === 'number' ? order : DEFAULT_ORDER,
  };
}

type RouteKind = 'web' | 'api';

/** Discovers every module's route file for one channel and mounts it. */
async function buildRouter(kind: RouteKind): Promise<ExpressRouter> {
  const container = Router();
  const modules = await discoverModules();

  const pending = modules
    .map((module) => ({
      module,
      file: kind === 'web' ? module.webRoutesFile : module.apiRoutesFile,
    }))
    .filter(
      (entry): entry is { module: DiscoveredModule; file: string } => entry.file !== undefined,
    );

  const loaded = await Promise.all(
    pending.map(({ module, file }) => loadRoutes(module, file, kind)),
  );

  // Deterministic order: explicit `order` first, then module name.
  loaded.sort((a, b) => a.order - b.order || a.moduleName.localeCompare(b.moduleName));

  for (const routes of loaded) {
    container.use(routes.basePath, routes.router);
  }

  logger.info(
    { kind, modules: loaded.map((entry) => `${entry.moduleName}${entry.basePath}`) },
    `Registered ${loaded.length} ${kind} route module(s)`,
  );

  return container;
}

/** Builds the web and API routers from whatever modules exist on disk. */
export async function buildModuleRouters(): Promise<{ web: ExpressRouter; api: ExpressRouter }> {
  return {
    web: await buildRouter('web'),
    api: await buildRouter('api'),
  };
}
