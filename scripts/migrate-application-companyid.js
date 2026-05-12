// One-time migration: populate companyId on applications that are missing it
// Run: node scripts/migrate-application-companyid.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from '../src/Models/Application.js';
import JobData from '../src/Models/JobData.js';
import Company from '../src/Models/Company.js';

dotenv.config();

async function migrate() {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/jobing';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const apps = await Application.find({ companyId: null }).lean();
    console.log(`Found ${apps.length} applications with missing companyId`);

    let updated = 0;
    for (const app of apps) {
        try {
            const job = await JobData.findById(app.jobId).select('companyName').lean();
            if (!job || !job.companyName) {
                console.log(`  SKIP app ${app._id}: no companyName on job`);
                continue;
            }

            const company = await Company.findOne({ companyName: job.companyName }).lean();
            if (!company) {
                console.log(`  SKIP app ${app._id}: no company found for "${job.companyName}"`);
                continue;
            }

            await Application.updateOne(
                { _id: app._id },
                { $set: { companyId: company._id } }
            );
            updated++;
            console.log(`  OK app ${app._id} → company ${company._id} (${company.companyName})`);
        } catch (err) {
            console.error(`  ERR app ${app._id}: ${err.message}`);
        }
    }

    console.log(`\nDone. Updated ${updated} of ${apps.length} applications.`);
    await mongoose.disconnect();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
