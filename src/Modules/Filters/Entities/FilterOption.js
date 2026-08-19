import { DataTypes } from 'sequelize';
import sequelize from '../../../Config/Database.js';
import Filter from './Filter.js';

const FilterOption = sequelize.define('FilterOption', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    filterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Filter,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: 'filter_options',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

// Setup relationships
Filter.hasMany(FilterOption, { foreignKey: 'filterId', as: 'options' });
FilterOption.belongsTo(Filter, { foreignKey: 'filterId', as: 'filter' });

export default FilterOption;
