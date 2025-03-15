import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database';

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
    cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'City',
    tableName: 'cities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    version: false,
});

export default City;
