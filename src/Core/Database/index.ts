import { sql } from 'drizzle-orm';
import { env } from '../../Config/Env.js';
import { logger } from '../Logger.js';
import { appDbContext } from './AppDbContext.js';
import { destroyDb, getDb } from './Client.js';

export { appDbContext } from './AppDbContext.js';
export { destroyDb, getDb, getPool } from './Client.js';

export interface DatabaseHealth {
  connected: boolean;
  driver: 'postgres';
  latencyMs?: number;
}

/** Pings the database. Returns a snapshot instead of throwing. */
export async function databaseHealth(): Promise<DatabaseHealth> {
  try {
    const startedAt = Date.now();
    await getDb().execute(sql`select 1`);
    return { connected: true, driver: 'postgres', latencyMs: Date.now() - startedAt };
  } catch {
    return { connected: false, driver: 'postgres' };
  }
}

/**
 * Loads the entity configurations, then checks the connection.
 * A missing database is fatal in production but only a warning elsewhere, so
 * development and tests can run without one.
 */
export async function connectDatabase(): Promise<void> {
  await appDbContext.load();

  const health = await databaseHealth();

  if (health.connected) {
    logger.info(
      { database: env.DB_URL ? '(db url)' : env.DB_NAME, latencyMs: health.latencyMs },
      'Connected to PostgreSQL',
    );
    return;
  }

  const message = 'Could not reach PostgreSQL';
  if (env.NODE_ENV === 'production') {
    throw new Error(message);
  }
  logger.warn({ host: env.DB_HOST, port: env.DB_PORT, database: env.DB_NAME }, message);
}

export async function disconnectDatabase(): Promise<void> {
  await destroyDb();
}
