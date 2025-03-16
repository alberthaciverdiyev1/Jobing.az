import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database.js';

class City extends Model {}

City.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'City',
    tableName: 'cities',
    timestamps: true,
    created_at: 'created_at',
    updated_at: 'updated_at',
    underscored: true,
    version: false,
});

export default City;
