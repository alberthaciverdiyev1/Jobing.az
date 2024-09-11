import { DataTypes } from "sequelize";
import sequelize from '../Config/Database.js';
import Company from './Company.js';
import Enums from '../Config/Enums.js';

const JobData = sequelize.define('JobData', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    salary: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    companyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: true,
    },
    companyName: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    jobType: {
        type: DataTypes.STRING(Object.values(Enums.JobTypes)),
        allowNull: false
    },
    postedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    sourceUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    redirectUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deletedAt:{
        type: DataTypes.DATE,
        defaultValue: null
    }
}, {
    tableName: 'JobData',
    timestamps: true
});

JobData.belongsTo(Company, { foreignKey: 'companyId' });

export default JobData;
