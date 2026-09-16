import type { Server } from 'node:http';
import type { Express } from 'express';
import { env } from '../../Config/Env.js';
import { logger } from '../Logger.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

export function startServer(app: Express): Server {
  const server = app.listen(env.PORT, () => {
    logger.info(
      `🚀 ${env.APP_NAME} listening on http://localhost:${env.PORT} (${env.NODE_ENV})`,
    );
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    logger.info({ signal }, 'Shutting down gracefully…');

    const timer = setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    timer.unref();

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
    process.on(signal, shutdown);
  }

  return server;
}
