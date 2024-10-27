import { DataTypes } from "sequelize";
import sequelize from '../Config/Database.js';
import Company from './Company.js';
import Enums from '../Config/Enums.js';
import Category from "./Category.js";

const Job = sequelize.define('Job', {
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
    minSalary: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    maxSalary: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    companyName: {
        type: DataTypes.STRING,
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
    }
}, {
    tableName: 'jobs',
    timestamps: true,
    paranoid: true,
});

Job.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Job.belongsTo(Category, { foreignKey: 'subCategoryId', as: 'subCategory' });

export default Job;
