import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database';
import Enums from '../Config/Enums';

class Job extends Model {}

Job.init({
    uniqueKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    minSalary: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    maxSalary: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    minAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    maxAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    currencySign: {
        type: DataTypes.STRING,
        defaultValue: "₼",
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    companyId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    educationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    experienceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    jobType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    postedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    sourceUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    redirectUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    version: false,
    underscored: true,
});

export default Job;
