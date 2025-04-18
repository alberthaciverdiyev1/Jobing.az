import express from 'express';
import path from 'path';
import cron from 'node-cron';
import routes from './src/Routes/Main.js';
import sequelize from './src/Config/Database.js';
import loggerMiddleware from './src/Middlewares/Logger.js';
import Production from './src/Helpers/Production.js';
import sendEmail from './src/Helpers/NodeMailer.js';
// import i18n from 'i18n';
import cookieParser from 'cookie-parser';
import {requestAllSites} from "./src/Helpers/Automation.js";
import bot, {listenTgCommands, sendTgMessage} from "./src/Helpers/TelegramBot.js";
import TelegramBot from 'node-telegram-bot-api';


const to = process.env.CRON_MAIL_USER;
//
// i18n.configure({
//     locales: ['en', 'ru', 'az'],
//     directory: './src/locales',
//     defaultLocale: 'az',
//     cookie: 'lang'
// });

const app = express();
const port = process.env.PR_PORT || 3000;

bot.on('message', listenTgCommands);

app.set('view engine', 'ejs');
app.set('views', './src/Views');
app.set('trust proxy', true);

app.use(express.static(path.resolve('./src/Public')));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({extended: true, limit: '100mb'}));

app.use(cookieParser());
// app.use(i18n.init);
app.use((req, res, next) => {
    res.locals.Production = Production;
    next();
});
app.use(loggerMiddleware);
app.use('/', routes);
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
    next();
});


app.use(async (err, req, res, next) => {
    const errorData = {
        title: 'Global Error',
        text: `${err.stack}`
    };
    await sendEmail(errorData, to);
    res.status(500).send('Something went wrong!');
});


cron.schedule('0 13 * * 5', async () => {
    await requestAllSites();
});

cron.schedule('0 9,16,20 * * *', async () => {
    await requestAllSites(true);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
});

process.on('uncaughtException', async (err) => {
    const errorData = {
        title: 'Uncaught Exception',
        text: `${err.stack}`
    };
    process.env.NODE_ENV === "production" ? await sendEmail(errorData, to) : console.log(errorData);
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    const errorData = {
        title: 'Unhandled Promise Rejection',
        text: `Promise: ${promise}, Reason: ${reason}`
    };
    process.env.NODE_ENV === "production" ? await sendEmail(errorData, to) : console.log(errorData);
});
