import express from 'express';
import path from 'path';
import cron from 'node-cron';
import routes from './src/Routes/Main.js';
import sequelize from './src/Config/Database.js';
import loggerMiddleware from './src/Middlewares/Logger.js';
import Production from './src/Helpers/Production.js';
import axios from 'axios';
import sendEmail from './src/Helpers/NodeMailer.js';
import i18n from 'i18n';
import cookieParser from 'cookie-parser';
const to = process.env.CRON_MAIL_USER;

i18n.configure({
    locales: ['en', 'ru', 'az'],
    directory: './src/locales',
    defaultLocale: 'az',
    cookie: 'lang'
});

const app = express();
const port = process.env.PR_PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './src/Views');
app.set('trust proxy', true);

app.use(express.static(path.resolve('./src/Public')));
app.use(express.json());
app.use(cookieParser());
app.use(i18n.init);
// app.use(visitorLogger);

app.use((req, res, next) => {
    res.locals.Production = Production;
    next();
});

app.use(loggerMiddleware);
app.use('/', routes);

// swaggerDocs(app);

// cron.schedule('0 7-23 * * *', async () => {
cron.schedule('0 7-23/3 * * *', async () => {
    try {
        const response = await axios.post(`http://localhost:${port}/api/jobs`);
        if (response.status === 200 || response.status === 201) {
            let endData = {
                title: "Cron ended",
                text: `${response.data.message} <br> ${response.data.errors}`
            };
            await sendEmail(endData, to);
        }
    } catch (error) {
        let errorData = {
            title: "Cron ended with error",
            text: `${error}`
        };
        await sendEmail(errorData, to);
    }

    await axios.post(`http://localhost:${port}/api/jobs/remove-duplicates`);
    await axios.post(`http://localhost:${port}/api/companies/remove-duplicates`);

});


app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
    next();
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
