import mongoose from 'mongoose';
import 'dotenv/config';
import Log from './src/Modules/System/Entities/Log.js';

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Log.countDocuments();
    console.log("Total logs:", count);
    process.exit(0);
}
test();
