import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import responseTime from 'response-time';
import routes from './src/Routes/Main.js';
import sequelize, { connectPromise } from './src/Config/Database.js';
import setupAssociations from './src/Config/Associations.js';

// Enterprise logging & security
import { morganMiddleware, globalErrorHandler, logError } from './src/Middlewares/Logger.js';
import { helmetMiddleware, csrfProtection, csrfInjector } from './src/Middlewares/Security.js';

import Production from './src/Helpers/Production.js';
import sendEmail from './src/Helpers/NodeMailer.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const i18n = require('i18n');
import cookieParser from 'cookie-parser';
import authMiddleware from './src/Middlewares/Auth.js';
import seoMiddleware from './src/Middlewares/Seo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const to = process.env.CRON_MAIL_USER || 'admin@example.com';
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

app.set('view engine', 'ejs');
app.set('views', './src/Views');
app.set('trust proxy', true);

if (process.env.NODE_ENV === 'production') {
    app.set('view cache', true);
}

// Security & Middlewares
app.use(helmetMiddleware);
app.use(compression({ threshold: 512, level: 6 }));
app.use(morganMiddleware);

app.use(responseTime((req, res, time) => {
    res.setHeader('X-Response-Time', `${Math.round(time)}ms`);
}));

app.use(express.static(path.resolve('./Public'), { maxAge: '1y', immutable: true, etag: true }));
app.use('/uploads', express.static(path.resolve('./uploads'), { maxAge: '1d', etag: true }));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(cookieParser());

// CSRF Protection (must come after cookie-parser)
app.use(csrfProtection);
app.use(csrfInjector);

app.use(authMiddleware.setUser);
app.use(seoMiddleware);
app.use(i18n.init);
app.use((req, res, next) => {
    if (!req.cookies.lang) req.setLocale('az');
    res.locals.locale = req.locale || 'az';
    next();
});

app.use((req, res, next) => {
    res.locals.Production = Production;
    res.locals.req = req;
    res.locals.__l = (obj, field) => {
        if (!obj) return '';
        const locale = res.locals.locale || req.locale || 'az';
        if (locale !== 'az' && obj[field + '_' + locale]) return obj[field + '_' + locale];
        return obj[field] || '';
    };
    next();
});

// App Routes
app.use('/', routes);

// 404 and Global Error Handling
app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.xhr || req.headers.accept?.includes('json')) {
        return res.status(404).json({ error: 'Tapılmadı' });
    }
    res.status(404).render('Partials/Error.ejs', { title: '404 - Tapılmadı', message: 'Səhifə tapılmadı.' });
});
app.use(globalErrorHandler);

// Wait for DB connection
connectPromise.then(async () => {
    setupAssociations();
    // Removed sequelize.sync() - Enterprise apps use migrations via sequelize-cli!
    console.log('PostgreSQL database connected & associations initialized.');

    app.listen(port, '0.0.0.0', () => {
        console.log(`Enterprise Server is running at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err.message);
});

process.on('uncaughtException', async (err) => {
    logError(err, { source: 'uncaughtException' });
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

process.on('unhandledRejection', async (reason) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    logError(err, { source: 'unhandledRejection' });
});
