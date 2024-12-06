// tg.js
import TelegramBot from 'node-telegram-bot-api';
import { requestAllSites , cancelRequest } from "./Automation.js";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

export async function sendTgMessage(data = 'Test') {
    await bot.sendMessage('@jobingazz', data);
}

export const listenTgCommands = async (msg) => {
    if (msg.text === '/all') {
        await requestAllSites();
        await bot.sendMessage(msg.chat.id, 'Bot Started Crone For All Cities');
    }
    if (msg.text === '/main') {
        await requestAllSites(true);
        await bot.sendMessage(msg.chat.id, 'Bot Started Crone For Main Cities');
    }
    if(msg.text === '/cancel'){
       await cancelRequest();
       await bot.sendMessage(msg.chat.id, 'All Request Was Cancelled');

    }
};

export default bot;
