import validator from "validator";
import CompanyController from "../Controllers/CompanyController.js";

const Validators = {

    registerValidator: (req, res, next) => {
        const { username, email, password, confirmPassword } = req.body;
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        if (!validator.isLength(username, { min: 3, max: 20 })) {
            return res.status(400).json({ error: "Username must be between 3 and 20 characters long" });
        }

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Please enter a valid email address" });
        }

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        if (!validator.isLength(password, { min: 6 })) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        if (!confirmPassword) {
            return res.status(400).json({ error: "Password is required" });
        }

        if (!validator.isLength(confirmPassword, { min: 6 })) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        if (!validator.equals(password, confirmPassword)) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        next();
    },
    siteValidator: (req, res, next) => {
        const { name, url } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Site name is required" });
        }
        if (!url) {
            return res.status(400).json({ error: "Site url is required" });
        }
        next();

    },
    companyValidator: (req, res, next) => {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Company name is required" });
        }
        next();
    },

    mailValidator: (req, res, next) => {
        const { title, text } = req.body.data;
        if (!title) {
            return res.status(200).json({ code: 400, message: "Title is required" });
        }
        if (!text) {
            return res.status(200).json({ code: 400, message: "Text is required" });
        }
        next();
    }

}
export default Validators;

