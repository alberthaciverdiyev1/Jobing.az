import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

sequelize.authenticate()
    .then(() => console.log('Successfully connected to the database.'))
    .catch(err => console.error('Connection error:', err));

export default sequelize;
