import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database';

class Site extends Model {}

Site.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Site',
    tableName: 'sites',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    version: false,
    underscored: true,
});

export default Site;
