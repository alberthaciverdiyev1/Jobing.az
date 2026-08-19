import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const PricingPlan = sequelize.define('PricingPlan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    type: { type: DataTypes.ENUM('premium', 'promote'), allowNull: false },
    duration: { type: DataTypes.ENUM('daily', 'monthly'), allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    features: { type: DataTypes.JSONB, defaultValue: [] },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'pricing_plans', timestamps: true });
export default PricingPlan;
