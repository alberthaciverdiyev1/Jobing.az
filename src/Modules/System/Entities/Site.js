import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const Site = sequelize.define('Site', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING, allowNull: false, unique: true },
    value: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.STRING, defaultValue: 'string' }
}, { tableName: 'site_settings', timestamps: true });
export default Site;
