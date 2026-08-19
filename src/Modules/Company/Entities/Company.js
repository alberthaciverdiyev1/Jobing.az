import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyName: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    imageUrl: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    bannerUrl: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    website: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    phone: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    email: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    address: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    workingHours: {
        type: DataTypes.JSONB,
        defaultValue: {}
    },
    socialLinks: {
        type: DataTypes.JSONB,
        defaultValue: {}
    },
    foundedYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    employeeCount: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    industry: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    uniqueKey: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'companies',
    timestamps: true
});

export default Company;
