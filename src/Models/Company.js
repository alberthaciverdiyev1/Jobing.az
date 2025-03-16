import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database.js';

class Company extends Model {}

Company.init(
    {
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        image_url: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        unique_key: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Company',
        tableName: 'companies',
        timestamps: true,
        paranoid: true,
        underscored: true,
    }
);

export default Company;
