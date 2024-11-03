import express from 'express';
import path from 'path';
import cron from 'node-cron';
import routes from './src/Routes/Main.js';
import sequelize from './src/Config/Database.js';
import swaggerDocs from './src/Config/Swagger.js';
import loggerMiddleware from './src/Middlewares/Logger.js';
import Production from './src/Helpers/Production.js';
import axios from 'axios';
import sendEmail from './src/Helpers/NodeMailer.js';
import { title } from 'process';

const app = express();
const port = process.env.PR_PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', './src/Views');
app.use(express.static(path.resolve('./src/Public')));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.Production = Production;
    next();
});

app.use(loggerMiddleware);
app.use('/', routes);

// swaggerDocs(app);

cron.schedule('0 7-23/2 * * *', async () => {
    const to = process.env.CRON_MAIL_USER;
    const now = new Date();

    const formatDate = (date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };
 
    try {
        let startData = {
            title: "Cron started",
            text: `Crone started at ${formatDate(now)}`
        };
        await sendEmail(startData, to);

        const response = await axios.post(`http://localhost:${port}/api/jobs`);

        if (response.status === 200 || response.status === 201) {
            let endData = {
                title: "Cron ended",
                text: `${response.data.message}`
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
});


app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
