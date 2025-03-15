import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database';

class Company extends Model {}

Company.init({
    companyName: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    imageUrl: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    uniqueKey: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
    }
}, {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    version: false,
    underscored: true,
});

export default Company;
