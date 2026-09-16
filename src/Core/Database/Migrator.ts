import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FileMigrationProvider,
  Migrator,
  type Migration,
  type MigrationProvider,
  type MigrationResultSet,
} from 'kysely/migration';
import { logger } from '../Logger.js';
import { discoverModules } from '../Provider/ModuleDiscovery.js';
import { getDb } from './Client.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

async function isDirectory(target: string): Promise<boolean> {
  try {
    return (await fs.stat(target)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Migrations are owned by whoever owns the table:
 *  - `Core/Database/Migrations` for infrastructure (sessions, …)
 *  - `Modules/<Name>/Migrations` for domain tables
 *
 * Resolved relative to this file, so it follows `src` (tsx) and `dist` (build).
 */
async function collectMigrationFolders(): Promise<string[]> {
  const folders: string[] = [];

  const coreMigrations = path.join(currentDir, 'Migrations');
  if (await isDirectory(coreMigrations)) folders.push(coreMigrations);

  for (const module of await discoverModules()) {
    if (module.migrationsDirectory) folders.push(module.migrationsDirectory);
  }

  return folders;
}

/** Merges the migration folders into a single provider, rejecting name clashes. */
class MultiFolderMigrationProvider implements MigrationProvider {
  constructor(private readonly folders: string[]) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const merged: Record<string, Migration> = {};

    for (const migrationFolder of this.folders) {
      const provider = new FileMigrationProvider({ fs, path, migrationFolder });
      const migrations = await provider.getMigrations();

      for (const [name, migration] of Object.entries(migrations)) {
        if (merged[name]) {
          throw new Error(`Duplicate migration name "${name}" (found in ${migrationFolder})`);
        }
        merged[name] = migration;
      }
    }

    return merged;
  }
}

async function createMigrator(): Promise<Migrator> {
  const folders = await collectMigrationFolders();

  return new Migrator({
    db: getDb(),
    provider: new MultiFolderMigrationProvider(folders),
  });
}

function reportResults(results: MigrationResultSet, direction: string): void {
  const { error, results: executed } = results;

  for (const result of executed ?? []) {
    logger.info(`${result.direction === 'Down' ? 'reverted' : 'applied'} ${result.migrationName}`);
  }

  if (error) {
    logger.error({ err: error }, `Migration failed while running ${direction}`);
    throw error instanceof Error ? error : new Error(String(error));
  }

  if (!executed || executed.length === 0) {
    logger.info('No migrations to run');
  }
}

export async function migrateToLatest(): Promise<void> {
  reportResults(await (await createMigrator()).migrateToLatest(), 'migrate');
}

export async function migrateDown(): Promise<void> {
  reportResults(await (await createMigrator()).migrateDown(), 'rollback');
}

export async function migrationStatus(): Promise<void> {
  const migrations = await (await createMigrator()).getMigrations();

  if (migrations.length === 0) {
    process.stdout.write('No migrations found\n');
    return;
  }

  for (const migration of migrations) {
    process.stdout.write(`${migration.executedAt ? '✔' : '·'} ${migration.name}\n`);
  }
}
