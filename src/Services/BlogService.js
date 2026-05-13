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
            const blog = await Blog.findById(id);
            if (!blog) {
                throw new Error('Blog not found');
            }
            await Blog.findByIdAndDelete(id);
            return {message: 'Blog successfully deleted'};
        } catch (error) {
            throw new Error('Error deleting blog: ' + error.message);
        }
    },

    details: async (slug) => {
        try {
            const blog = await Blog.findOne({slug: slug});
            if (!blog) {
                throw new Error('Blog not found');
            }
            return blog;
        } catch (error) {
            throw new Error('Error retrieving blog: ' + error.message);
        }
    },

    getAll: async (data) => {
        try {
            const blogs = await Blog.find(data).sort({ createdAt: -1 });
            return {
                status: 200,
                message: 'Blogs retrieved successfully',
                data: blogs
            };
        } catch (error) {
            throw new Error('Error retrieving blogs: ' + error.message);
        }
    },
    getOne: async (id) => {
        try {
            const blog = await Blog.findById(id);
            return blog;
        } catch (error) {
            throw new Error('Error retrieving blog: ' + error.message);
        }
    },
    update: async (id, updateData) => {
        try {
            const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
            if (!blog) {
                throw new Error('Blog not found');
            }
            return blog;
        } catch (error) {
            throw new Error('Error updating blog: ' + error.message);
        }
    }
};

export default BlogService;
