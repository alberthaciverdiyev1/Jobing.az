import winston from 'winston';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Custom format
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
);

const logger = winston.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
    ]
});

// If not in production, log to console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            customFormat
        )
    }));
}

// Morgan stream for express
export const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream: { write: message => logger.info(message.trim()) } }
);

// Global Error Handler Middleware
export const globalErrorHandler = (err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
    // In pure MVC, we render an error page
    res.status(err.status || 500);
    res.render('Partials/Error.ejs', { 
        title: 'Xəta Baş Verdi',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Sistemdə gözlənilməz bir xəta baş verdi.'
    });
};

export const logError = (err, context = {}) => {
    logger.error(`${err.message} - Context: ${JSON.stringify(context)}`);
};

export default logger;
