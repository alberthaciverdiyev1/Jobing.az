import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const Visitor = sequelize.define('Visitor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ip: { type: DataTypes.STRING, allowNull: false },
    userAgent: { type: DataTypes.TEXT, allowNull: true },
    path: { type: DataTypes.STRING, allowNull: true },
    visitedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'visitors', timestamps: true });
export default Visitor;
