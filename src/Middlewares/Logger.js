import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

let logger = null;
 
const configureLogger = () => {
    const { combine, timestamp, json } = format;

    logger = createLogger({
        level: process.env.LOG_LEVEL || 'info',
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

const loggerMiddleware = (err, req, res, next) => {
    if (logger) {
        logger.error({
            message: err.message,
            stack: err.stack,
            method: req.method,
            url: req.url,
            ip: req.ip,
        });
    } else {
        console.error('Logger is not configured.');
    }

    res.status(500).json({ error: err.message });
    next();
};

export default loggerMiddleware;
