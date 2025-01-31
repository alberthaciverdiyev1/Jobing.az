import TelegramBot from 'node-telegram-bot-api';
import { requestAllSites, cancelRequest } from "./Automation.js";
import sendEmail from "./NodeMailer.js";
import JobService from '../Services/JobDataService.js';
import jobDataService from "../Services/JobDataService.js";

let sendTo = null;

// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const bot = new TelegramBot(process.env.TELEGRAM_CHECK_JOB_BOT_TOKEN, { polling: true });

export async function sendTgMessage(data = 'Test') {
    await bot.sendMessage('@jobingazz', data);
}
export async function sendNewJobRequest(jobData) {
    const textMessage = `
        📌 Job Title: ${jobData.title}
        📝 Description: ${jobData.description}
        📍 Location: ${jobData.location}
        💰 Salary: ${jobData.minSalary} - ${jobData.maxSalary} AZN
        👤 Age Range: ${jobData.minAge} - ${jobData.maxAge} years
        🏢 Company: ${jobData.companyName}
        🌆 City ID: ${jobData.cityId}
        📚 Education Level: ${jobData.educationId}
        📅 Experience: ${jobData.experienceId}
        🔑 Id: ${jobData.id}
        📧 Email: ${jobData.email}
        📞 Phone: ${jobData.phone}
        🌐 Source: [${jobData.sourceUrl}](${jobData.redirectUrl})
        👤 User: ${jobData.userName}
        🏅 Premium: ${jobData.isPremium ? 'Yes' : 'No'}
        🔵 Active: ${jobData.isActive ? 'Yes' : 'No'}`;

    const sendTo = jobData.email;

    await bot.sendMessage('@jobingaz', textMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Accept', callback_data: `accept_${jobData.id}` },
                    { text: 'Reject', callback_data: `reject_${jobData.id}` }
                ]
            ]
        }
    });
}

bot.on('callback_query', async (callbackQuery) => {
    const userId = callbackQuery.from.id;
    const callbackData = callbackQuery.data;
    const messageId = callbackQuery.message.message_id;
    const chatId = callbackQuery.message.chat.id;

    const [action, jobId] = callbackData.split('_');

    if (action === 'accept') {
        await bot.sendMessage(
            chatId,
            `✅ Accepted by: ${callbackQuery.from.username}`
        );

        sendEmail(
            { title: "Jobing.az", text: "Sizin vakansiyanız saytda dərc edildi" },
            sendTo,
            "support - Jobing.az"
        );
       let message = await jobDataService.updateJob(jobId,true);
        await bot.sendMessage(
            chatId,
            `✅ ${message} ✅`
        );
    }

    if (action === 'reject') {
        
        await bot.sendMessage(
            chatId,
            `❌ Rejected by: ${callbackQuery.from.username}`
        );
        let message = await jobDataService.updateJob(jobId,false);

        await bot.sendMessage(
            chatId,
            `❌ ${message} ❌`
        );

        sendEmail(
            { title: "Jobing.az", text: "Sizin vakansiyanız saytda dərc edilmədi. Xahiş edirik məlumatları düzgün qeyd edib yenidən cəhd edəsiniz. Əgər hər hansı yanlışlıq olduğunu düşünürsünüzsə support@jobing.az ilə əlaqə qurun" },
            sendTo,
            "support - Jobing.az"
        );
    }
});


export const listenTgCommands = async (msg) => {
    if (msg.text === '/all') {
        await requestAllSites();
        await bot.sendMessage(msg.chat.id, 'Bot Started Crone For All Cities');
    }
    if (msg.text === '/main') {
        await requestAllSites(true);
        await bot.sendMessage(msg.chat.id, 'Bot Started Crone For Main Cities');
    }
    if (msg.text === '/cancel') {
        await cancelRequest();
        await bot.sendMessage(msg.chat.id, 'All Request Was Cancelled');

    }
};

export default bot;
