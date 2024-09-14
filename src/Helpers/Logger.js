import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

let logger;

const configureLogger = async () => {
    if (process.env.NODE_ENV !== 'production') {
        try {
            const { default: DailyRotateFile } = await import('winston-daily-rotate-file');
            const { combine, timestamp, json } = format;

            // Create and configure the logger
            logger = createLogger({
                level: process.env.LOG_LEVEL || 'info',
                format: combine(timestamp(), json()),
                transports: [
                    new DailyRotateFile({
                        filename: 'app/logs/combined-%DATE%.log',
                        datePattern: 'YYYY-MM-DD',
                        maxFiles: '14d',
                    }),
                ],
            });
        } catch (error) {
            console.error('Error configuring logger:', error);
        }
    }
};

export { configureLogger, logger };
