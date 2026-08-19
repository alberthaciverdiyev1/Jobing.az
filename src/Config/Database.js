import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from "fs";
import path from "path";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE || 'jobing',
    process.env.DB_USERNAME || 'admin',
    process.env.DB_PASSWORD || 'secret',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 20,
            min: 2,
            acquire: 30000,
            idle: 10000
        }
    }
);

export const connectPromise = sequelize.authenticate()
    .then(() => {
        console.log('Successfully connected to the PostgreSQL database.');
        // We will do model synchronization explicitly if needed
        return sequelize.sync({ alter: true });
    })
    .catch(err => {
        console.error('Connection error:', err);
    });

export default sequelize;
