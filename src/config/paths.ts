import { fileURLToPath } from 'node:url';
import path from 'node:path';

/** dist/config/paths.js -> dist -> project root */
const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const ROOT_DIR = path.resolve(currentDir, '..', '..');

export const paths = {
  root: ROOT_DIR,
  src: path.join(ROOT_DIR, 'src'),
  dist: path.join(ROOT_DIR, 'dist'),
  views: path.join(ROOT_DIR, 'views'),
  locales: path.join(ROOT_DIR, 'locales'),
  public: path.join(ROOT_DIR, 'public'),
  storage: path.join(ROOT_DIR, 'storage'),
  uploads: path.join(ROOT_DIR, 'storage', 'uploads'),
  logs: path.join(ROOT_DIR, 'storage', 'logs'),
} as const;

export type Paths = typeof paths;
