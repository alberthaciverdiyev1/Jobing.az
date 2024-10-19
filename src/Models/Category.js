import { DataTypes } from 'sequelize';
import sequelize from '../Config/Database.js';

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'category',
    timestamps: true,
    paranoid: true,
    // indexes: [
    //     {
    //         fields: ['parentId'],
    //     }
    // ]
});

// Category.belongsTo(Category, { foreignKey: 'parentId', as: 'Parent' });

export default Category;
