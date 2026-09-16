import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../../Config/Env.js';
import { logger } from '../Logger.js';
import { appDbContext } from './AppDbContext.js';

/** Fail fast instead of hanging a request when the database is unreachable. */
const CONNECTION_TIMEOUT_MS = 5_000;

let pool: Pool | null = null;
let client: ReturnType<typeof createClient> | null = null;

function createPool(): Pool {
  const shared = {
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
    ...(env.DB_SSL ? { ssl: { rejectUnauthorized: false } } : {}),
  };

  const created = env.DB_URL
    ? new Pool({ ...shared, connectionString: env.DB_URL })
    : new Pool({
        ...shared,
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
      });

  // Idle clients can be dropped by the server; without this the process crashes.
  created.on('error', (error) => {
    logger.error({ err: error }, 'Unexpected PostgreSQL pool error');
  });

  return created;
}

function createClient() {
  return drizzle(getPool(), { schema: appDbContext.schema });
}

export function getPool(): Pool {
  pool ??= createPool();
  return pool;
}

/**
 * The Drizzle query builder. Import this from repositories/services.
 * Call `appDbContext.load()` first (`connectDatabase()` does) if you need the
 * relational query API.
 */
export function getDb(): ReturnType<typeof createClient> {
  client ??= createClient();
  return client;
}

export async function destroyDb(): Promise<void> {
  if (client) {
    await client.$client.end();
    client = null;
  }
  pool = null;
}
