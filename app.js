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
    const to = process.env.CRON_MAIL_USER;


const app = express();
const port = process.env.PR_PORT || 3000;

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

cron.schedule('0 */2 7-23 * * *', async () => {
// // cron.schedule('0 7-23/2 * * *', async () => {
    // const to = process.env.CRON_MAIL_USER;
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

        const response = await axios.post(`http://localhost:3000/api/jobs`);
        // const response = await axios.post(`http://localhost:${port}/api/jobs`);
        

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

// cron.schedule('0 */1 7-23 * * *', async () => {

    // const formatDate = (date) => {
    //     return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    // };

    // const createEmailTemplate = (title, message, time) => {
    //     return `
    //             <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    //                 <h2 style="color: #007BFF; text-align: center;">${title}</h2>
    //                 <p style="font-size: 14px; text-align: center; color: #555;">${time}</p>
    //                 <hr style="margin: 20px 0; border-top: 1px solid #eee;">
    //                 <p style="font-size: 16px; margin-bottom: 20px;">${message}</p>
    //                 <footer style="text-align: center; font-size: 12px; color: #999;">
    //                     <p>Cron Task Notification</p>
    //                 </footer>
    //             </div>
    //         `;
    // };

    // const executeTask = async (retryCount = 0) => {
    //     try {
    //         const startTime = new Date();
    //         let startData = createEmailTemplate(
    //             "Cron Started",
    //             `Cron task started successfully.`,
    //             `Time: ${formatDate(startTime)}`
    //         );
    //         await sendEmail({ title: "Cron Started", html: startData }, to, "Cron Started");

    //         const response = await axios.post(`http://localhost:${port}/api/jobs`);

    //         if (response.status === 200 || response.status === 201) {
    //             const endTime = new Date();
    //             let endData = createEmailTemplate(
    //                 "Cron Ended",
    //                 `Cron task ended successfully. Message: ${response.data.message}`,
    //                 `Time: ${formatDate(endTime)}`
    //             );
    //             await sendEmail({ title: "Cron Ended", html: endData }, to, "Cron Ended");
    //         }
    //     } catch (error) {
    //         const errorTime = new Date();
    //         let errorData = createEmailTemplate(
    //             "Error Occurred",
    //             `An error occurred: ${error.message || error}. The function will retry.`,
    //             `Time: ${formatDate(errorTime)}`
    //         );
    //         await sendEmail({ title: "Error Occurred", html: errorData }, to, "Cron Error Occured");

    //         if (retryCount < 3) {
    //             await executeTask(retryCount + 1);
    //         } else {
    //             await sendEmail({ title: "Error Occurred", html: errorData }, to, "Cron Error Occured");
    //         }
    //     }
    // };


    // await executeTask();
// });

app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
    next();
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
