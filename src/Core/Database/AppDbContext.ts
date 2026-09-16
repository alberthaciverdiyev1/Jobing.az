import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getTableName, is } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { logger } from '../Logger.js';
import { discoverModules, listSourceFiles } from '../Provider/ModuleDiscovery.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * The runtime counterpart of EF's `DbContext`: it collects every entity
 * configuration on disk and exposes them as one schema.
 *
 *  - `Core/Database/Configurations/*.ts`  infrastructure tables
 *  - `Modules/<Name>/Configurations/*.ts`  domain tables
 *
 * Nothing is registered by hand — add a configuration file and it shows up.
 */
export class AppDbContext {
  private readonly tables = new Map<string, PgTable>();
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;

    this.tables.clear();

    const folders = [
      path.join(currentDir, 'Configurations'),
      ...(await discoverModules()).map((module) => module.configurationsDirectory),
    ].filter((folder): folder is string => folder !== undefined);

    for (const folder of folders) {
      for (const file of await listSourceFiles(folder)) {
        const loaded = (await import(pathToFileURL(file).href)) as Record<string, unknown>;

        for (const exported of Object.values(loaded)) {
          if (!is(exported, PgTable)) continue;

          const name = getTableName(exported);
          if (this.tables.has(name)) {
            throw new Error(`Duplicate table configuration for "${name}" (${file})`);
          }

          this.tables.set(name, exported);
        }
      }
    }

    this.loaded = true;
    logger.debug({ tables: [...this.tables.keys()] }, 'AppDbContext loaded');
  }

  /** Schema object handed to Drizzle, enabling `db.query.<table>`. */
  get schema(): Record<string, PgTable> {
    return Object.fromEntries(this.tables);
  }

  get allTables(): PgTable[] {
    return [...this.tables.values()];
  }

  table(name: string): PgTable | undefined {
    return this.tables.get(name);
  }
}

export const appDbContext = new AppDbContext();
