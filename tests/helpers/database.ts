import { Client, type ClientConfig } from 'pg';
import { env } from '../../src/Config/Env.js';

/**
 * Integration tests need a real PostgreSQL. When one is not reachable they are
 * skipped rather than failed, so `npm test` stays green on a fresh checkout.
 */
export async function canConnectToDatabase(): Promise<boolean> {
  const config: ClientConfig = env.DB_URL
    ? { connectionString: env.DB_URL, connectionTimeoutMillis: 1500 }
    : {
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        connectionTimeoutMillis: 1500,
      };

  const client = new Client(config);

  try {
    await client.connect();
    await client.query('select 1');
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => undefined);
  }
}
