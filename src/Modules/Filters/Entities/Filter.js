import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';

const Filter = sequelize.define('Filter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'filters',
    timestamps: true,
    paranoid: false, // We'll handle soft deletes manually or switch this to true
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default Filter;
