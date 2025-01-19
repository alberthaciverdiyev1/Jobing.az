import axios from "axios";
import { sendTgMessage } from "./TelegramBot.js";
import fs from 'fs';

let cancelTokenSource;

export async function requestAllSites(main = false) {
    const fileName = './src/Config/OnlyMainContent.json';
    const content = main ? 'requestMainCities=true' : 'requestMainCities=false';
    await fs.promises.access(fileName, fs.constants.F_OK);
    await fs.promises.writeFile(fileName, content);

    const port = process.env.PR_PORT || 3000;

    cancelTokenSource = axios.CancelToken.source();

    try {
        // const response = await axios.post(`http://localhost:${port}/api/jobs`, null, {

        const response = await axios.post(`https://jobing.az/api/jobs`, null, {
            cancelToken: cancelTokenSource.token 
        });

        if (response.status === 200 || response.status === 201) {
            // await sendEmail(endData, process.env.CRON_MAIL_USER);
            await sendTgMessage(`Cron ended : ${response.data.message} <=> Errors: ${response.data.errors || 0}`);
        }
        return response;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
        } else {
            // await sendEmail(errorData, process.env.CRON_MAIL_USER);
            await sendTgMessage(`Cron ended with error : ${error}`);
        }
    }
}

export async function cancelRequest() {
    if (cancelTokenSource) {
        cancelTokenSource.cancel('Request was canceled by user.');
        cancelTokenSource = null;
    }
}
