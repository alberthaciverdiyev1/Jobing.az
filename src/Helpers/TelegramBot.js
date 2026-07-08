import TelegramBot from 'node-telegram-bot-api';
import { requestAllSites, cancelRequest } from "./Automation.js";
import sendEmail from "./NodeMailer.js";
import JobService from '../Services/JobDataService.js';
import jobDataService from "../Services/JobDataService.js";
import CVService from '../Services/CVService.js';
import VisitorService from "../Services/VisitorService.js";

let sendTo = null;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
// const bot = new TelegramBot(process.env.TELEGRAM_CHECK_JOB_BOT_TOKEN, { polling: true });

export async function sendTgMessage(data = 'Test') {
    await bot.sendMessage('@jobingaz1', data);
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

export async function sendNewCVRequest(cvData) {
    const textMessage = `
        📄 CV Title: ${cvData.title}
        👤 Full Name: ${cvData.fullName || 'N/A'}
        📧 Email: ${cvData.email}
        📞 Phone: ${cvData.phone || 'N/A'}
        🔑 Id: ${cvData.id}
        📝 Type: ${cvData.type || 'created'}
        🟢 Active: ${cvData.isActive ? 'Yes' : 'No'}`;

    await bot.sendMessage('@jobingaz', textMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Accept', callback_data: `accept_cv_${cvData.id}` },
                    { text: 'Reject', callback_data: `reject_cv_${cvData.id}` }
                ]
            ]
        }
    });
}

export async function sendNewJobSeekerRequest(data) {
    const textMessage = `
👤 Yeni İş Axtarıram Elanı
📋 Vəzifə: ${data.title}
👤 Ad: ${data.userName}
📞 Telefon: ${data.phone || 'Qeyd edilməyib'}
📧 Email: ${data.email || 'Qeyd edilməyib'}
🔗 Link: jobing.az/is-axtaran/${data.slug}`;

    await bot.sendMessage('@jobingaz', textMessage);
}

export async function sendPromotionRequest(data) {
    const textMessage = `
📌 Yeni Promosyon / Premium Sorğusu
🏢 Vakansiya: ${data.jobTitle}
🏭 Şirkət: ${data.companyName}
💎 Plan: ${data.planName}
💰 Qiymət: ${data.price} AZN
📆 Müddət: ${data.duration}
📞 Telefon: ${data.phone}
👤 İstifadəçi: ${data.userName || 'Qeydiyyatsız'}
🔗 Link: ${data.jobUrl}`;

    await bot.sendMessage('@jobingaz', textMessage);
}

bot.on('callback_query', async (callbackQuery) => {
    const userId = callbackQuery.from.id;
    const callbackData = callbackQuery.data;
    const messageId = callbackQuery.message.message_id;
    const chatId = callbackQuery.message.chat.id;

    const parts = callbackData.split('_');
    const action = parts[0];
    const isCv = parts[1] === 'cv';
    const targetId = isCv ? parts.slice(2).join('_') : parts.slice(1).join('_');

    if (isCv) {
        if (action === 'accept') {
            await bot.sendMessage(chatId, `✅ CV Accepted by: ${callbackQuery.from.username}`);
            const cv = await CVService.toggleActive(targetId, true);
            if (cv) {
                sendEmail(
                    { title: "Jobing.az", text: "Sizin CV-niz saytda dərc edildi." },
                    cv.email || sendTo,
                    "support - Jobing.az"
                );
                await bot.sendMessage(chatId, '✅ CV activated successfully ✅');
            }
        }

        if (action === 'reject') {
            await bot.sendMessage(chatId, `❌ CV Rejected by: ${callbackQuery.from.username}`);
            const cv = await CVService.toggleActive(targetId, false);
            if (cv) {
                sendEmail(
                    { title: "Jobing.az", text: "Sizin CV-niz saytda dərc edilmədi. Xahiş edirik məlumatları düzgün qeyd edib yenidən cəhd edəsiniz." },
                    cv.email || sendTo,
                    "support - Jobing.az"
                );
                await bot.sendMessage(chatId, '❌ CV deactivated ❌');
            }
        }
        return;
    }

    if (action === 'accept') {
        await bot.sendMessage(
            chatId,
            `✅ Accepted by: ${callbackQuery.from.username}`
        );

        sendEmail(
            { title: "Jobing.az", text: "Sizin vakansiyanız saytda dərc edildi." },
            sendTo,
            "support - Jobing.az"
        );
        let message = await jobDataService.updateJob(targetId, true);
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
        let message = await jobDataService.updateJob(targetId, false);

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
    if (msg.text === '/views') {
        let count = await VisitorService.dailyCount();
        console.log({ count })
        await bot.sendMessage(msg.chat.id, `Daily visitor count: ${count}`);
    }
};

export default bot;
