import path from 'node:path';
import { modulesRoot } from '../Provider/ModuleDiscovery.js';

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
