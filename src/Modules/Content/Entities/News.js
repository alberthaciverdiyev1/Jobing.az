import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const News = sequelize.define('News', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    excerpt: { type: DataTypes.TEXT, allowNull: true },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    sourceUrl: { type: DataTypes.STRING, allowNull: true },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
    publishedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'news', timestamps: true });
export default News;
