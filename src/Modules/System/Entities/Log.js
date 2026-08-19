import {DataTypes} from 'sequelize';
import sequelize from '../../../Config/Database.js';

const Log = sequelize.define('Log', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    level: {type: DataTypes.STRING, allowNull: false},
    message: {type: DataTypes.TEXT, allowNull: false},
    meta: {type: DataTypes.JSONB, defaultValue: {}},
    timestamp: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
}, {tableName: 'logs', timestamps: false});
export default Log;
