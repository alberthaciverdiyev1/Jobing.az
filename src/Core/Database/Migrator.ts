import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileMigrationProvider, Migrator, type MigrationResultSet } from 'kysely/migration';
import { logger } from '../Logger.js';
import { getDb } from './Client.js';

/** Resolves next to this file, so it follows src (tsx) vs dist (compiled). */
const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'Migrations');

function createMigrator(): Migrator {
  return new Migrator({
    db: getDb(),
    provider: new FileMigrationProvider({ fs, path, migrationFolder: migrationsDir }),
  });
}

function reportResults(results: MigrationResultSet, direction: string): void {
  const { error, results: executed } = results;

  for (const result of executed ?? []) {
    const label = result.direction === 'Down' ? 'reverted' : 'applied';
    logger.info(`${label} ${result.migrationName}`);
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
  reportResults(await createMigrator().migrateToLatest(), 'migrate');
}

export async function migrateDown(): Promise<void> {
  reportResults(await createMigrator().migrateDown(), 'rollback');
}

export async function migrationStatus(): Promise<void> {
  const migrations = await createMigrator().getMigrations();

  if (migrations.length === 0) {
    process.stdout.write('No migrations found\n');
    return;
  }

  for (const migration of migrations) {
    process.stdout.write(`${migration.executedAt ? '✔' : '·'} ${migration.name}\n`);
  }
}
