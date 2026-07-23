/**
 * Standalone Telegram bot worker — runs as a single fork process in PM2.
 * Separated from the web cluster to prevent 409 polling conflicts.
 */
import 'dotenv/config';
import bot, { listenTgCommands } from './src/Helpers/TelegramBot.js';
import { connectPromise } from './src/Config/Database.js';

bot.on('message', listenTgCommands);

connectPromise
    .then(() => {
        console.log('Telegram bot worker connected to MongoDB, starting polling...');
    })
    .catch(err => {
        console.error('Telegram bot worker DB connection failed:', err.message);
    });

process.on('unhandledRejection', (reason) => {
    const msg = reason instanceof Error ? reason.message : String(reason);
    // Suppress polling noise
    if (msg.includes('polling_error') || msg.includes('ETELEGRAM') || msg.includes('getUpdates')) return;
    console.error('Telegram bot unhandled rejection:', msg);
});
