import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

dotenv.config();

// Set public DNS resolvers for SRV record resolution (needed for MongoDB Atlas)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const dbURI = process.env.NODE_ENV !== "production" ? `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` : process.env.REMOTE_DB_URL;

const connectPromise = mongoose.connect(dbURI, {
    maxPoolSize: 20,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 30000,
    heartbeatFrequencyMS: 10000,
});

connectPromise
    .then(() => console.log('Successfully connected to the database.'))
    .catch(err => console.error('Connection error:', err));

export { connectPromise };
export default mongoose;
