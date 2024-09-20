import {DataTypes} from 'sequelize';
import sequelize from '../Config/Database.js';

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sourceUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'companies',
    timestamps: true,
    paranoid: true,
});

export default City;
