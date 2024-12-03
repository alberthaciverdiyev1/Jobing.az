// tg.js
import TelegramBot from 'node-telegram-bot-api';
import { requestAllSites } from "./Automation.js";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

export async function sendTgMessage(data = 'Test') {
    await bot.sendMessage('@jobingazz', data);
}

export const listenTgCommands = async (msg) => {
    if (msg.text === '/restart') {
        await requestAllSites();
        await bot.sendMessage(msg.chat.id, 'Restarted Scrape');
    }
};

export default bot;
