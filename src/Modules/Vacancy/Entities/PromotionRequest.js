import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const PromotionRequest = sequelize.define('PromotionRequest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vacancyId: { type: DataTypes.INTEGER, allowNull: false }, // References Vacancy
    planId: { type: DataTypes.INTEGER, allowNull: false }, // References PricingPlan
    userId: { type: DataTypes.INTEGER, allowNull: false }, // References User
    phone: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
    paidAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    paymentId: { type: DataTypes.STRING, allowNull: true },
    requestedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    processedAt: { type: DataTypes.DATE, allowNull: true },
    processedBy: { type: DataTypes.INTEGER, allowNull: true }, // References User(Admin)
    deletedAt: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'promotion_requests', timestamps: true });
export default PromotionRequest;
