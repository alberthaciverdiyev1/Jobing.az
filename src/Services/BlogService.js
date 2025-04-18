import Enums from '../Config/Enums.js';
import City from '../Models/City.js';
import Blog from "../Models/Blog.js";

const BlogService = {
    create: async (data) => {
        try {
            const result = await Blog.create(data);

            if (result) {
                return {
                    status: 201,
                    message: 'Insert completed',
                    data: result
                };
            } else {
                throw new Error('No records were inserted.');
            }
        } catch (error) {
            throw new Error('Error creating blog: ' + error.message);
        }
    },
    delete: async (id) => {
        try {
            const city = await City.findById(id);
            if (!city) {
                throw new Error('City not found');
            }
            await city.remove();
            return {message: 'City successfully deleted'};
        } catch (error) {
            throw new Error('Error deleting city: ' + error.message);
        }
    },

    details: async (slug) => {
        try {
            const blog = await Blog.findOne({slug: slug});
            if (!blog) {
                throw new Error('City not found');
            }
            return blog;
        } catch (error) {
            throw new Error('Error retrieving city: ' + error.message);
        }
    },

    getAll: async (data) => {
        try {
            const blogs = await Blog.find(data);
            return {
                status: 200,
                message: 'Blogs retrieved successfully',
                data: blogs
            };
        } catch (error) {
            throw new Error('Error retrieving blogs: ' + error.message);
        }
    },
    update: async (id, updateData) => {
        try {
            const city = await City.findById(id);
            if (!city) {
                throw new Error('City not found');
            }
            await city.updateOne(updateData);
            return city;
        } catch (error) {
            throw new Error('Error updating city: ' + error.message);
        }
    }
};

export default BlogService;
