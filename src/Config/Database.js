import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbURI = process.env.NODE_ENV !== "production" ? `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` : process.env.REMOTE_DB_URL;

const connectPromise = mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50,
    minPoolSize: 5,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

connectPromise
    .then(() => console.log('Successfully connected to the database.'))
    .catch(err => console.error('Connection error:', err));

export { connectPromise };
export default mongoose;
