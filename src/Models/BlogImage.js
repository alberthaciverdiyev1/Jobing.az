import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../Config/Database.js';
import Blog from './Blog.js';

class BlogImage extends Model {}

BlogImage.init({
    blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'blogs',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'BlogImage',
    tableName: 'blog_images',
    timestamps: true,
    underscored: true,
});

// BlogImage.belongsTo(Blog, { foreignKey: 'blog_id', as: 'blog' });

export default BlogImage;