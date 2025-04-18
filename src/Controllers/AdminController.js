
const AdminController = {

    adminIndex: async (req, res) => {
        const view = {
            title: 'Admin Panel',
            body: "Home/Index.ejs",
            js: "Index.js"
        };
        res.render('Admin/Main', view);
    },

    adminCategoryView: async (req, res) => {
        const view = {
            title: 'Categories - Admin Panel',
            body: "Category/Index.ejs",
            js: "Category.js"
        };
        res.render('Admin/Main', view);
    },

    adminBlogsView: async (req, res) => {
        const view = {
            title: 'Blogs - Admin Panel',
            body: "Blog/Index.ejs",
            js: "Blog.js"
        };
        res.render('Admin/Main', view);
    },
    adminBlogsAddView: async (req, res) => {
        const view = {
            title: 'Blogs - Admin Panel',
            body: "Blog/Add.ejs",
            js: "Blog.js"
        };
        res.render('Admin/Main', view);
    },
};

export default AdminController;
