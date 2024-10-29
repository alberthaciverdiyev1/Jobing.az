import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to the database.'))
.catch(err => console.error('Connection error:', err));

export default mongoose;
