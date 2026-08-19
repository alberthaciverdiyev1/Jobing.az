import TelegramBot from 'node-telegram-bot-api';
import sendEmail from "./NodeMailer.js";
import JobService from '../Modules/Vacancy/Services/VacancyService.js';
import jobDataService from "../Modules/Vacancy/Services/VacancyService.js";
import CVService from '../Modules/CV/Services/CVService.js';
import JobSeekerService from '../Modules/CV/Services/JobSeekerService.js';
import User from '../Modules/Auth/Entities/User.js';
import VisitorService from "../Modules/System/Services/VisitorService.js";

let sendTo = null;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

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
            inline_keyboard: [[{text: 'Accept', callback_data: `accept_${jobData.id}`}, {
                text: 'Reject',
                callback_data: `reject_${jobData.id}`
            }]]
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
            inline_keyboard: [[{text: 'Accept', callback_data: `accept_cv_${cvData.id}`}, {
                text: 'Reject',
                callback_data: `reject_cv_${cvData.id}`
            }]]
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

    await bot.sendMessage('@jobingaz', textMessage, {
        reply_markup: {
            inline_keyboard: [[{text: '✅ Qəbul et', callback_data: `accept_js_${data.id}`}, {
                text: '❌ Rədd et',
                callback_data: `reject_js_${data.id}`
            }]]
        }
    });
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
    const isJs = parts[1] === 'js';
    const targetId = isCv || isJs ? parts.slice(2).join('_') : parts.slice(1).join('_');

    if (isJs) {
        if (action === 'accept') {
            await bot.sendMessage(chatId, `✅ İş Axtarıram elanı qəbul edildi: ${callbackQuery.from.username}`);
            const doc = await JobSeekerService.toggleActive(targetId, true);
            if (doc) {
                const user = doc.postedBy ? await User.findById(doc.postedBy).lean() : null;
                sendEmail({
                    title: "Jobing.az",
                    text: "Sizin \"İş Axtarıram\" elanınız saytda dərc edildi."
                }, doc.email || user?.email || sendTo, "support - Jobing.az").catch(() => {
                });
                await bot.sendMessage(chatId, '✅ Elan aktiv edildi ✅');
            }
        }
        if (action === 'reject') {
            await bot.sendMessage(chatId, `❌ İş Axtarıram elanı rədd edildi: ${callbackQuery.from.username}`);
            const doc = await JobSeekerService.toggleActive(targetId, false);
            if (doc) {
                const user = doc.postedBy ? await User.findById(doc.postedBy).lean() : null;
                sendEmail({
                    title: "Jobing.az",
                    text: "Sizin \"İş Axtarıram\" elanınız saytda dərc edilmədi. Zəhmət olmasa məlumatları yoxlayıb yenidən cəhd edin."
                }, doc.email || user?.email || sendTo, "support - Jobing.az").catch(() => {
                });
                await bot.sendMessage(chatId, '❌ Elan deaktiv edildi ❌');
            }
        }
        return;
    }

    if (isCv) {
        if (action === 'accept') {
            await bot.sendMessage(chatId, `✅ CV Accepted by: ${callbackQuery.from.username}`);
            const cv = await CVService.toggleActive(targetId, true);
            if (cv) {
                sendEmail({
                    title: "Jobing.az",
                    text: "Sizin CV-niz saytda dərc edildi."
                }, cv.email || sendTo, "support - Jobing.az");
                await bot.sendMessage(chatId, '✅ CV activated successfully ✅');
            }
        }

        if (action === 'reject') {
            await bot.sendMessage(chatId, `❌ CV Rejected by: ${callbackQuery.from.username}`);
            const cv = await CVService.toggleActive(targetId, false);
            if (cv) {
                sendEmail({
                    title: "Jobing.az",
                    text: "Sizin CV-niz saytda dərc edilmədi. Xahiş edirik məlumatları düzgün qeyd edib yenidən cəhd edəsiniz."
                }, cv.email || sendTo, "support - Jobing.az");
                await bot.sendMessage(chatId, '❌ CV deactivated ❌');
            }
        }
        return;
    }

    if (action === 'accept') {
        await bot.sendMessage(chatId, `✅ Accepted by: ${callbackQuery.from.username}`);

        sendEmail({title: "Jobing.az", text: "Sizin vakansiyanız saytda dərc edildi."}, sendTo, "support - Jobing.az");
        let message = await jobDataService.updateJob(targetId, true);
        await bot.sendMessage(chatId, `✅ ${message} ✅`);
    }

    if (action === 'reject') {

        await bot.sendMessage(chatId, `❌ Rejected by: ${callbackQuery.from.username}`);
        let message = await jobDataService.updateJob(targetId, false);

        await bot.sendMessage(chatId, `❌ ${message} ❌`);

        sendEmail({
            title: "Jobing.az",
            text: "Sizin vakansiyanız saytda dərc edilmədi. Xahiş edirik məlumatları düzgün qeyd edib yenidən cəhd edəsiniz. Əgər hər hansı yanlışlıq olduğunu düşünürsünüzsə support@jobing.az ilə əlaqə qurun"
        }, sendTo, "support - Jobing.az");
    }
});


export const listenTgCommands = async (msg) => {
    if (msg.text === '/views') {
        const report = await VisitorService.dailyReport();

        // Hourly bar chart
        const hourBars = report.hourlyStats.map(h => {
            const bar = '▰'.repeat(Math.min(h.visits, 20));
            const label = String(h._id).padStart(2, '0') + ':00';
            return `${label} ${bar} ${h.visits}`;
        }).join('\n');

        // Top IPs
        const ipList = report.topIps.length > 0 ? report.topIps.map((v, i) => `${i + 1}. \`${v.ip}\` — ${v.visitCount} dəfə | ${(v.userAgent || '-').substring(0, 40)}`).join('\n') : 'Məlumat yoxdur';

        const diff = report.today.totalVisits - report.yesterday.totalVisits;
        const diffSign = diff >= 0 ? `📈 +${diff}` : `📉 ${diff}`;

        const msgText = `
📊 *Günlük Visitor Hesabatı*
━━━━━━━━━━━━━━━━━━━

👤 *Bugün* (${new Date().toLocaleDateString('az-AZ', {day: 'numeric', month: 'long'})})
• Ziyarət: ${report.today.totalVisits}
• Unikal IP: ${report.today.uniqueVisitors}
• Dünənlə fərq: ${diffSign}

📅 *Dünən*
• Ziyarət: ${report.yesterday.totalVisits}
• Unikal IP: ${report.yesterday.uniqueVisitors}

📆 *Son 7 gün*: ${report.weekly.totalVisits} ziyarət
🏛️ *Ümumi*: ${report.allTime.totalVisits} ziyarət, ${report.allTime.totalUnique} unikal IP

🕐 *Saatlıq bölgü:*
${hourBars || 'Məlumat yoxdur'}

🔝 *Ən aktiv IP-lər (bugün):*
${ipList}

⏰ Yenilənmə: ${new Date().toLocaleTimeString('az-AZ', {hour: '2-digit', minute: '2-digit'})}`;

        await bot.sendMessage(msg.chat.id, msgText, {parse_mode: 'Markdown'});
    }
};

export default bot;

// Register command listeners
bot.on('message', listenTgCommands);
