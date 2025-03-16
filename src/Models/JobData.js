import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database.js';
import Company from './Company.js';

class Job extends Model {}

Job.init(
    {
        unique_key: {
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
            type: DataTypes.TEXT,
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        min_salary: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        max_salary: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        min_age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        max_age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        currency_sign: {
            type: DataTypes.STRING,
            defaultValue: '₼',
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sub_category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        education_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        experience_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_premium: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        job_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        posted_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        source_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        redirect_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Job',
        tableName: 'jobs',
        timestamps: true,
        underscored: true,
    }
);

Job.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

export default Job;
