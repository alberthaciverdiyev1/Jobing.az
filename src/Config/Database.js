import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

dotenv.config();

// Fix DNS resolution for SRV records (some networks block SRV via the local DNS proxy)
dns.setServers(['192.168.31.1', '8.8.8.8', '1.1.1.1']);

const dbURI = process.env.NODE_ENV !== "production" ? `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` : process.env.REMOTE_DB_URL;

const connectPromise = mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connectPromise
    .then(() => console.log('Successfully connected to the database.'))
    .catch(err => console.error('Connection error:', err));

export { connectPromise };
export default mongoose;
