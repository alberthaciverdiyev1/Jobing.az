import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Resolves to `src/Modules` in development and `dist/Modules` after a build. */
const modulesRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'Modules',
);

/**
 * Absolute template path for a module-owned view.
 *
 * Views live inside their module (`Modules/User/Views/Login.hbs`), so we hand
 * Express an absolute path instead of relying on a shared `views` directory —
 * that keeps two modules from ever resolving the same template name.
 *
 *   res.render(moduleView('User', 'Login'), { ... })
 */
export function moduleView(module: string, view: string): string {
  return path.join(modulesRoot, module, 'Views', view);
}

export { modulesRoot };
