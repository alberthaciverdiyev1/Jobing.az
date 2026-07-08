import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import routes from './src/Routes/Main.js';
import sequelize, { connectPromise } from './src/Config/Database.js';
import { errorLogger, logError, logInfo } from './src/Middlewares/Logger.js';
import Production from './src/Helpers/Production.js';
import sendEmail from './src/Helpers/NodeMailer.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const i18n = require('i18n');
import cookieParser from 'cookie-parser';
import {requestAllSites} from "./src/Helpers/Automation.js";
import bot, {listenTgCommands, sendTgMessage} from "./src/Helpers/TelegramBot.js";
import TelegramBot from 'node-telegram-bot-api';
import authMiddleware from './src/Middlewares/Auth.js';
import seoMiddleware from './src/Middlewares/Seo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const to = process.env.CRON_MAIL_USER;
i18n.configure({
    locales: ['az', 'en', 'ru'],
    directory: path.join(__dirname, 'src', 'Locales'),
    defaultLocale: 'az',
    cookie: 'lang',
    objectNotation: true,
    updateFiles: false
});

const app = express();
const port = process.env.PR_PORT || 3000;

bot.on('message', listenTgCommands);

app.set('view engine', 'ejs');
app.set('views', './src/Views');
app.set('trust proxy', true);

app.use(express.static(path.resolve('./src/Public')));
app.use('/uploads', express.static(path.resolve('./uploads')));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({extended: true, limit: '100mb'}));

app.use(cookieParser());
app.use(authMiddleware.setUser);
app.use(seoMiddleware);
app.use(i18n.init);
// Force Azerbaijani locale when no language cookie is set
app.use((req, res, next) => {
    if (!req.cookies.lang) {
        req.setLocale('az');
    }
    next();
});
app.use((req, res, next) => {
    res.locals.Production = Production;
    res.locals.req = req;
    // Locale-aware field helper: picks title_en / title_ru based on current locale
    res.locals.__l = (obj, field) => {
        if (!obj) return '';
        const locale = res.locals.locale || req.locale || 'az';
        if (locale !== 'az' && obj[field + '_' + locale]) return obj[field + '_' + locale];
        return obj[field] || '';
    };
    next();
});
app.use('/', routes);
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
    next();
});

// Error-logging middleware — placed after routes to catch all route errors
app.use(errorLogger);

// Global Express error handler — logs + emails + responds
app.use(async (err, req, res, next) => {
    logError(err, { source: 'global-error-handler', method: req?.method, url: req?.originalUrl || req?.url });
    const errorData = {
        title: 'Global Error',
        text: `${err.stack}`
    };
    try { await sendEmail(errorData, to); } catch {}
    if (!res.headersSent) {
        res.status(500).send('Something went wrong!');
    }
});


cron.schedule('0 13 * * 5', async () => {
    await requestAllSites();
});

cron.schedule('0 9,16,20 * * *', async () => {
    await requestAllSites(true);
});

// Wait for DB connection before accepting requests to prevent 500 errors from buffering timeouts
connectPromise.then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Database connection failed, starting server without DB:', err.message);
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running at http://localhost:${port} (NO DATABASE)`);
    });
});

process.on('uncaughtException', async (err) => {
    logError(err, { source: 'uncaughtException' });
    const errorData = {
        title: 'Uncaught Exception',
        text: `${err.stack}`
    };
    process.env.NODE_ENV === "production" ? await sendEmail(errorData, to) : console.log(errorData);
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    logError(err, { source: 'unhandledRejection' });
    const errorData = {
        title: 'Unhandled Promise Rejection',
        text: `Promise: ${promise}, Reason: ${reason}`
    };
    process.env.NODE_ENV === "production" ? await sendEmail(errorData, to) : console.log(errorData);
});
