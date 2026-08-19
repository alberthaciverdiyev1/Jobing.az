import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const Vacancy = sequelize.define('Vacancy', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true }, 
    minSalary: { type: DataTypes.INTEGER, allowNull: true },
    maxSalary: { type: DataTypes.INTEGER, allowNull: true },
    minAge: { type: DataTypes.INTEGER, allowNull: true },
    maxAge: { type: DataTypes.INTEGER, allowNull: true },
    companyName: { type: DataTypes.STRING, allowNull: true },
    companyId: { type: DataTypes.STRING, allowNull: true },
    userName: { type: DataTypes.STRING, allowNull: true },
    isPremium: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    applicationMethod: { type: DataTypes.ENUM('cv', 'contact', 'both'), defaultValue: 'both' }
}, {
    tableName: 'vacancies',
    timestamps: true,
    indexes: [
        { fields: ['isActive', 'createdAt'] },
        { fields: ['companyName'] },
        { fields: ['slug'] }
    ]
});
export default Vacancy;
