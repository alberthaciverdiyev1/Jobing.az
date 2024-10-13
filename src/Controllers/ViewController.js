const ViewController = {
    home: async (req, res) => {
        res.render("home/index.hbs");
    }, 
    auth: async (req, res) => {
        res.render("auth/index.hbs");
    },
};

export default ViewController;
