import BlogService from "../../Services/BlogService.js";

const BlogController = {
    list: async (req, res) => {
        const view = {
            title: 'Bloqlar',
            body: "Blog/List.ejs",
            js: "Blog.js"
        };
        res.render('Main', view);
    },

    details: async (req, res) => {
        const view = {
            title: 'Bloq > Detallar',
            body: "Blog/Details.ejs",
            js: "Blog.js"
        };
        res.render('Main', view);
    },
    listByAjax: async (req, res) => {
        return await BlogService.list()
    },

    detailsByAjax: async (req, res) => {
        return await BlogService.findBySlug(req.params.slug)
    },
};

export default BlogController;
