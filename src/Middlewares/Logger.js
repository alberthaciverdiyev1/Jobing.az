import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

let logger = null;

const configureLogger = () => {
    const { combine, timestamp, json } = format;

    logger = createLogger({
        level: 'error',
        format: combine(timestamp(), json()),
        transports: [
            new transports.DailyRotateFile({
                filename: 'src/Logs/combined-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxFiles: '14d',
            }),
        ],
    });

    console.log('Logger configured successfully.');
};

configureLogger();

/**
 * Write an error to the log file.
 * Can be called from anywhere — Express middleware, error handlers, process hooks.
 */
export function logError(err, metadata = {}) {
    if (!logger) return;
    try {
        logger.error({
            message: err?.message || String(err),
            stack: err?.stack,
            ...metadata,
        });
    } catch {
        // silent
    }
}

/**
 * Express error-logging middleware — place AFTER routes.
 * Logs the error and passes it to the next error handler.
 */
export function errorLogger(err, req, res, next) {
    logError(err, {
        method: req?.method,
        url: req?.originalUrl || req?.url,
        ip: req?.ip,
    });
    next(err);
}

/**
 * Patch console.error globally so all console.error calls
 * also write to the Winston log file.
 * Internal Node.js deprecation warnings are filtered out.
 */
export function patchConsoleError() {
    const original = console.error;
    console.error = (...args) => {
        const msg = args.map(a => (typeof a === 'object' ? (a?.stack || a?.message || JSON.stringify(a)) : String(a))).join(' ');
        // Skip Node.js internal deprecation/MongoDB warnings — they're noise
        if (msg.includes('DeprecationWarning') || msg.includes('MONGODB DRIVER') || msg.includes('DEP0')) {
            return original.apply(console, args);
        }
        logError(new Error(msg), { source: 'console.error' });
        original.apply(console, args);
    };
}

export default logger;
