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
    value: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'category',
            key: 'value'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    tableName: 'category',
    timestamps: true,
    paranoid: true,
    indexes: [
        {
            unique: true,
            fields: ['value']
        }
    ]
});

Category.belongsTo(Category, { foreignKey: 'parentId' });

export default Category;
