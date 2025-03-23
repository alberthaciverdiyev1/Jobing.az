import Blog from "../Models/Blog.js";
import BlogImage from "../Models/BlogImage.js";
import { Sequelize, Op } from "sequelize";

const BlogService = {
    list: async (keyword = null) => {
        try {
            let query = {};
            if (keyword) {
                const keywordQuery = { [Op.iLike]: '%${keyword}%' };
                query[Op.or] = [
                    { az_title: keywordQuery },
                    { az_content: keywordQuery },
                    { ru_title: keywordQuery },
                    { ru_content: keywordQuery },
                    { en_title: keywordQuery },
                    { en_content: keywordQuery },
                ];
            }
            return await Blog.findAll({
                where: query,
                include: [{ model: BlogImage, as: 'images' }],
            });
        } catch (error) {
            throw new Error('Error retrieving blogs: ' + error.message);
        }
    },

    findBySlug: async (slug) => {
        try {
            const blog = await Blog.findOne({
                where: { slug },
                include: [{ model: BlogImage, as: 'images' }],
            });

            if (blog) {
                return { status: 200, message: 'Success', data: blog };
            }

            return { status: 404, message: 'Not Found', data: null };
        } catch (error) {
            throw new Error('Error retrieving blog: ' + error.message);
        }
    }
};

export default BlogService;