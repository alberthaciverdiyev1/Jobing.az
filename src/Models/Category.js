import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database';

class Category extends Model {}

Category.init({
    localCategoryId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    smartJobAz: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    offerAz: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jobSearch: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bossAz: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    helloJobAz: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    version: false,
});

Category.hasOne(Category, {
    foreignKey: 'localCategoryId',
    sourceKey: 'id',
    as: 'Parent',
});

export default Category;
