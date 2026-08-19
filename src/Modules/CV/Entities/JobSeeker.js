import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const JobSeeker = sequelize.define('JobSeeker', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    userName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    postedBy: { type: DataTypes.INTEGER, allowNull: false },
    postedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    cvUrl: { type: DataTypes.STRING, allowNull: true },
    cvFileName: { type: DataTypes.STRING, allowNull: true },
    salary: { type: DataTypes.INTEGER, allowNull: true },
    salaryNegotiable: { type: DataTypes.BOOLEAN, defaultValue: false },
    viewers: { type: DataTypes.JSONB, defaultValue: [] }
}, {
    tableName: 'job_seekers',
    timestamps: true
});
export default JobSeeker;
