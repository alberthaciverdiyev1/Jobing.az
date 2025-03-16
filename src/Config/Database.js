import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    logging: true,
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to the MySQL database.');
        // await sequelize.sync({ force: false });
        // console.log('Database & tables synchronized!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

connectDatabase();

export default sequelize;
