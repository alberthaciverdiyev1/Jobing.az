import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database.js';
import Enums from '../Config/Enums.js';

class ForeignCategory extends Model {}

ForeignCategory.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    website_id: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [Enums.SitesWithId],
        },
    }
}, {
    sequelize,
    modelName: 'ForeignCategory',
    tableName: 'foreign_categories',
    timestamps: true,
    created_at: 'created_at',
    updated_at: 'updated_at',
    version: false,
    underscored: true,
});

export default ForeignCategory;
