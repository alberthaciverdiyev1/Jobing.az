import mongoose from 'mongoose';
import 'dotenv/config';
import { logInfo, logError } from './src/Middlewares/Logger.js';

async function test() {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jobing_az_dev");
    console.log("Connected");
    await logInfo('test', 'This is a test info message');
    await logError(new Error("Test Error"), { source: 'test' });
    console.log("Logged");
    process.exit(0);
}
test();
