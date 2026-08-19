import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const Application = sequelize.define('Application', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vacancyId: { type: DataTypes.INTEGER, allowNull: false }, // References Vacancy.id
    userId: { type: DataTypes.INTEGER, allowNull: false }, // References User.id
    cvId: { type: DataTypes.INTEGER, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'reviewed', 'accepted', 'rejected'), defaultValue: 'pending' },
    appliedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'applications', timestamps: true });
export default Application;
