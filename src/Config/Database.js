import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbURI = process.env.NODE_ENV !== "production" ? `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` : process.env.REMOTE_DB_URL;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to the database.'))
.catch(err => console.error('Connection error:', err));

export default mongoose;
