import { fileURLToPath } from 'node:url';
import path from 'node:path';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolves to `src` in development and `dist` after a build, so anything that
 * lives inside the source tree (views) is found in both.
 */
const packageRoot = path.resolve(currentDir, '..');

/** The repository root — files that are never compiled live here. */
export const ROOT_DIR = path.resolve(packageRoot, '..');

export const paths = {
  root: ROOT_DIR,
  package: packageRoot,
  views: path.join(packageRoot, 'Views'),
  locales: path.join(ROOT_DIR, 'locales'),
  public: path.join(ROOT_DIR, 'public'),
} as const;

export type Paths = typeof paths;
