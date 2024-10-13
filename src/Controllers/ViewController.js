const ViewController = {
    home: async (req, res) => {
        const view = {
            title: 'Home',
            body: "home/index.ejs",
            js: "Home.js"
        };
        res.render('main', view);
    },
    auth: async (req, res) => {
        const view = {
            title: 'Auth',
            body: "auth/index.ejs",
            js: "Auth.js"
        };
        res.render('main', view);
    },
    jobs: async (req, res) => {
        const view = {
            title: 'Jobs',
            body: "jobs/index.ejs",
            js: "Jobs.js"
        };
        res.render('main', view);
    },
};

export default ViewController;
