import Enums from "../Config/Enums.js";

const ViewController = {
    home: async (req, res) => {
        const view = {
            title: 'Home',
            body: "Home/Index.ejs",
            js: "Home.js"
        };
        res.render('Main', view);
    },
    auth: async (req, res) => {
        const view = {
            title: 'Auth',
            body: "Auth/Index.ejs",
            js: "Auth.js"
        };
        res.render('Main', view);
    },
    jobs: async (req, res) => {
        const view = {
            title: 'Jobs',
            body: "Jobs/Index.ejs",
            js: "Jobs.js"
        };
        res.render('Main', view);
    },
    aboutUs: async (req, res) => {
        const view = {
            title: 'About Us',
            body: "AboutUs/Index.ejs",
            js: null
        };
        res.render('Main', view);
    },
    contactUs: async (req, res) => {
        const view = {
            title: 'Contact Us',
            body: "ContactUs/Index.ejs",
            js: 'ContactUs.js'
        };
        res.render('Main', view);
    },
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


    education: (req, res) => {
        const educationData = Enums.Education;

        res.status(200).json(educationData);
    },
    experience: (req, res) => {
        const experience = Enums.Experience;
        res.status(200).json(experience);
    }
};

export default ViewController;
