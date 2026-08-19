import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const RssSource = sequelize.define('RssSource', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, defaultValue: 'job' },
    lastFetchedAt: { type: DataTypes.DATE, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'rss_sources', timestamps: true });
export default RssSource;
