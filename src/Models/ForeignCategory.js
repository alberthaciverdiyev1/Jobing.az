import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database';
import Enums from '../Config/Enums';

class ForeignCategory extends Model {}

ForeignCategory.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    websiteId: {
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    version: false,
    underscored: true,
});

export default ForeignCategory;
