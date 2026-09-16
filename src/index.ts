import { env } from './Config/Env.js';
import { connectDatabase, disconnectDatabase } from './Core/Database/index.js';
import { createApp } from './Core/Http/App.js';
import { registerProcessErrorHandlers } from './Core/Http/ErrorHandler.js';
import { startServer } from './Core/Http/Server.js';
import { logger } from './Core/Logger.js';

registerProcessErrorHandlers();

await connectDatabase();

const app = await createApp();
startServer(app, { onShutdown: disconnectDatabase });

logger.debug({ environment: env.NODE_ENV, locales: env.AVAILABLE_LOCALES }, 'Bootstrap complete');
