import Enums from "../Config/Enums.js";
import sendEmail from "../Helpers/NodeMailer.js";
import CategoryService from "../Services/CategoryService.js";
import CompanyService from "../Services/CompanyService.js";
import JobDataService from "../Services/JobDataService.js";
import VisitorService from "../Services/VisitorService.js";
import Blog from "../Models/Blog.js";
import BlogService from "../Services/BlogService.js";

const ViewController = {
    home: async (req, res) => {
        const view = {
            title: 'Ana Səhifə',
            body: "Home/NewHome.ejs",
            // body: "Home/Index.ejs",
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
            title: 'Vakansiyalar',
            body: "Jobs/Index.ejs",
            js: "Jobs.js"
        };
        res.render('Main', view);
    },
    blogs: async (req, res) => {
        const view = {
            title: 'Bloqlar',
            body: "Blog/List.ejs",
            js: "Blog.js"
        };
        res.render('Main', view);
    },

    blog: async (req, res) => {
        const {slug} = req.params;
        const blog = await BlogService.details(slug);
        const view = {
            title: blog.name,
            body: 'Blog/Details.ejs',
            js: 'Blog.js',
            blog: blog
        };
        res.render('Main', view);

    },

    aboutUs: async (req, res) => {
        const view = {
            title: 'Haqqımızda',
            body: "AboutUs/Index.ejs",
            js: null
        };
        res.render('Main', view);
    },
    faq: async (req, res) => {
        const view = {
            title: 'Tez-tez verilən suallar',
            body: "AboutUs/Faq.ejs",
            js: null
        };
        res.render('Main', view);
    },
    contactUs: async (req, res) => {
        const view = {
            title: 'Bizimlə Əlaqə',
            body: "ContactUs/Index.ejs",
            js: 'ContactUs.js'
        };
        res.render('Main', view);
    },
    addJob: async (req, res) => {
        const view = {
            title: 'Yeni vakansiya',
            body: "Jobs/Add.ejs",
            js: 'NewJob.js'
        };
        res.render('Main', view);
    },


    education: (req, res) => {
        const educationData = Enums.Education;

        res.status(200).json(educationData);
    },
    experience: (req, res) => {
        const experience = Enums.Experience;
        res.status(200).json(experience);
    },
    sendMail: async (req, res) => {
        const response = await sendEmail(req.body.data);
        res.status(200).json({status: response.status, message: response.message});

    },
    statistics: async (req, res) => {
        const company = await CompanyService.count()
        const vacancy = await JobDataService.count()
        const visitor = await VisitorService.count(30)
        const dailyVisitor = await VisitorService.dailyCount()
        const totalVisitor = await VisitorService.count(365)
        res.status(200).json({status: 200, message: "", data: {company, vacancy, visitor, totalVisitor, dailyVisitor}});

    }
};

export default ViewController;
