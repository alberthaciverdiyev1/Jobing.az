import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database.js';

class Category extends Model {}

Category.init({
    local_category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    smart_job_az: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    offer_az: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    job_search: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    boss_az: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    hello_job_az: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    created_at: 'created_at',
    updated_at: 'updated_at',
    underscored: true,
    version: false,
});

// Category.hasOne(Category, {
//     foreignKey: 'localCategoryId',
//     sourceKey: 'id',
//     as: 'Parent',
// });

export default Category;
