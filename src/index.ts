import { env } from './config/env.js';
import { logger } from './core/logger.js';
import { createApp } from './core/http/app.js';
import { registerProcessErrorHandlers } from './core/http/error-handler.js';
import { startServer } from './core/http/server.js';

registerProcessErrorHandlers();

const app = createApp();
startServer(app);

logger.debug({ environment: env.NODE_ENV, locales: env.AVAILABLE_LOCALES }, 'Bootstrap complete');
