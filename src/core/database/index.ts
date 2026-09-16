import { env } from '../../config/env.js';

/**
 * Data-layer bootstrap.
 *
 * The storage engine is intentionally not wired up yet — it is decided in the
 * data-layer step. This module is the single seam every repository/model will
 * depend on, so swapping the driver touches only this file.
 */
export interface DatabaseHealth {
  connected: boolean;
  driver: string;
}

let connected = false;

export async function connectDatabase(): Promise<void> {
  // TODO(data-layer): initialise the chosen driver (Mongo/Postgres/MySQL).
  connected = true;
}

export async function disconnectDatabase(): Promise<void> {
  connected = false;
}

export function databaseHealth(): DatabaseHealth {
  return { connected, driver: env.DB_CONNECTION };
}
