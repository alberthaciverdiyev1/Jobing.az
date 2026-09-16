/**
 * Resolves a module view to a path relative to the `views/` directory.
 *
 * All templates live in one place, grouped by module:
 *   views/User/Login.hbs  ->  moduleView('User', 'Login')
 *
 * The helper is the single place that encodes that convention, so moving the
 * view tree later means editing this file only.
 */
export function moduleView(module: string, view: string): string {
  return `${module}/${view}`;
}
