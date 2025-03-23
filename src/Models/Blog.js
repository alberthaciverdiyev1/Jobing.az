import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database.js';
import BlogImage from './BlogImage.js';

class Blog extends Model {}

Blog.init({
    slug: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    az_title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ru_title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    en_title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    az_content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ru_content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    en_content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    main_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    show_in_home_page: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Blog',
    tableName: 'blogs',
    timestamps: true,
    underscored: true,
});

// Blog.hasMany(BlogImage, { foreignKey: 'blog_id', as: 'images' });

export default Blog;