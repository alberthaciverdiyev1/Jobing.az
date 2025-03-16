import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database.js';

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
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Site',
    tableName: 'sites',
    timestamps: true,
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
    paranoid: true,
    version: false,
    underscored: true,
});

export default Site;
