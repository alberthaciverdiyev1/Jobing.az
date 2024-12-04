import axios from "axios";
import {sendTgMessage} from "./TelegramBot.js";
import fs from 'fs';


export async function requestAllSites(main = false) {

    const fileName = './src/Config/OnlyMainContent.json';
    const content = main ? 'requestMainCities=true' : 'requestMainCities=false';
    await fs.promises.access(fileName, fs.constants.F_OK);
    await fs.promises.writeFile(fileName, content);

    const port = process.env.PR_PORT || 3000;
    try {
        const response = await axios.post(`http://localhost:${port}/api/jobs`);
        if (response.status === 200 || response.status === 201) {
            // await sendEmail(endData, process.env.CRON_MAIL_USER);
            await sendTgMessage(`Cron ended : ${response.data.message} <=> Errors: ${response.data.errors || 0}`);

        }
        return response
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