import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Resolves to `src` in development and `dist` after a build, so every discovery
 * helper below works identically in both.
 */
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const modulesRoot = path.join(packageRoot, 'Modules');

export interface DiscoveredModule {
  /** Folder name, e.g. `User`. */
  name: string;
  directory: string;
  /** Absolute path to `Routes/Web.*`, when the module has pages. */
  webRoutesFile?: string;
  /** Absolute path to `Routes/Api.*`, when the module exposes JSON endpoints. */
  apiRoutesFile?: string;
  /** Absolute path to the module's `Migrations` folder, when it owns tables. */
  migrationsDirectory?: string;
  /** Absolute path to the module's `Views` folder, when it renders templates. */
  viewsDirectory?: string;
}

async function isDirectory(target: string): Promise<boolean> {
  try {
    return (await fs.stat(target)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Picks the first existing file for a base name. `tsx` runs the TypeScript
 * sources while the compiled build only has JavaScript, so both are probed.
 */
async function resolveFile(directory: string, baseName: string): Promise<string | undefined> {
  for (const extension of ['.ts', '.js']) {
    const candidate = path.join(directory, `${baseName}${extension}`);
    if (await isDirectory(candidate.replace(/\.(ts|js)$/, ''))) continue;
    try {
      if ((await fs.stat(candidate)).isFile()) return candidate;
    } catch {
      // try the next extension
    }
  }
  return undefined;
}

async function resolveDirectory(candidate: string): Promise<string | undefined> {
  return (await isDirectory(candidate)) ? candidate : undefined;
}

/**
 * Walks `Modules/` and reports what each module provides.
 * This is the single source of truth for route and migration registration —
 * modules are never listed by hand.
 */
export async function discoverModules(): Promise<DiscoveredModule[]> {
  let entries: string[];

  try {
    entries = await fs.readdir(modulesRoot);
  } catch {
    return [];
  }

  const modules: DiscoveredModule[] = [];

  for (const name of entries.sort()) {
    const directory = path.join(modulesRoot, name);
    if (!(await isDirectory(directory))) continue;

    modules.push({
      name,
      directory,
      webRoutesFile: await resolveFile(path.join(directory, 'Routes'), 'Web'),
      apiRoutesFile: await resolveFile(path.join(directory, 'Routes'), 'Api'),
      migrationsDirectory: await resolveDirectory(path.join(directory, 'Migrations')),
      viewsDirectory: await resolveDirectory(path.join(directory, 'Views')),
    });
  }

  return modules;
}
