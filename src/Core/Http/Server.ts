import type { Server } from 'node:http';
import type { Express } from 'express';
import { env } from '../../Config/Env.js';
import { logger } from '../Logger.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

export interface ServerHooks {
  /** Runs before the HTTP server closes — use it to release the database pool. */
  onShutdown?: () => Promise<void>;
}

export function startServer(app: Express, hooks: ServerHooks = {}): Server {
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 ${env.APP_NAME} listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  let shuttingDown = false;

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info({ signal }, 'Shutting down gracefully…');

    const forced = setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forced.unref();

    try {
      await hooks.onShutdown?.();
    } catch (error) {
      logger.error({ err: error }, 'Shutdown hook failed');
    }

    server.close((error) => {
      if (error) {
        logger.error({ err: error }, 'Error while closing HTTP server');
        process.exit(1);
      }
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, (received) => {
      void shutdown(received);
    });
  }

  return server;
}
