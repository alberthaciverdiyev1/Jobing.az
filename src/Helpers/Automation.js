import axios from "axios";
import sendEmail from "./NodeMailer.js";
import { sendTgMessage } from "./TelegramBot.js";


export async function requestAllSites() {
    const port = process.env.PR_PORT || 3000;
    try {
        const response = await axios.post(`http://localhost:${port}/api/jobs`);
        if (response.status === 200 || response.status === 201) {
            // await sendEmail(endData, process.env.CRON_MAIL_USER);
            await sendTgMessage(`Cron ended : ${response.data.message} <=> ${response.data.errors}`);

        }
    } catch (error) {
        // await sendEmail(errorData, process.env.CRON_MAIL_USER);
       await sendTgMessage(`Cron ended with error : ${error}`);
    }


    const jresponse = await axios.post(`http://localhost:${port}/api/jobs/remove-duplicates`);
    if (jresponse.status === 200 || jresponse.status === 201) {
        const cresponse = await axios.post(`http://localhost:${port}/api/companies/remove-duplicates`);
        if (cresponse.status === 200 || cresponse.status === 201) {
            await axios.post(`http://localhost:${port}/api/companies/download-logos`);
        }
    }
}