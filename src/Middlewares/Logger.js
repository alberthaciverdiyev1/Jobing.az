import Log from '../Models/Log.js';
import { sendTgMessage } from '../Helpers/TelegramBot.js';

/**
 * Log an info/warn message → MongoDB + Telegram group.
 * Errors should use logError() instead — only goes to DB, not Telegram.
 */
export async function logInfo(source, message, metadata = {}) {
    try {
        const level = metadata.level === 'warn' ? 'warn' : 'info';

        await Log.create({
            level,
            source,
            message,
            metadata,
            url: metadata.url,
            method: metadata.method,
            ip: metadata.ip,
        });

        // Only info level goes to Telegram — errors are handled by logError()
        if (level === 'info') {
            const tgMsg = `📋 [${source}] ${message}`;
            await sendTgMessage(tgMsg).catch(() => {});
        }
    } catch {
        // logger must never throw
    }
}

/**
 * Log an error → MongoDB + console.error.
 * Does NOT send to Telegram.
 */
export async function logError(err, metadata = {}) {
    try {
        const message = err?.message || String(err);

        await Log.create({
            level: 'error',
            source: metadata.source || 'app',
            message,
            metadata: {
                ...metadata,
                stack: err?.stack,
            },
            url: metadata.url,
            method: metadata.method,
            ip: metadata.ip,
        });

        console.error(`[ERROR] [${metadata.source || 'app'}] ${message}`);
        if (err?.stack) {
            console.error(err.stack);
        }
    } catch {
        console.error('Logger failed:', err);
    }
}

/**
 * Express error-logging middleware — placed AFTER routes.
 * Logs the error to DB and passes it to the next error handler.
 */
export function errorLogger(err, req, res, next) {
    logError(err, {
        source: 'express-error',
        method: req?.method,
        url: req?.originalUrl || req?.url,
        ip: req?.ip,
    });
    next(err);
}

const logger = { logInfo, logError, errorLogger };
export default logger;
