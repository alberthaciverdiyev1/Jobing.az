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

        req.validatedData = data;

        next();
    },
    addJobValidator: (req, res, next) => {
        const defaultValues = {
            title: 0,
            minSalary: 0,
            maxSalary: 0,
            minAge: 0,
            maxAge: 0,
            categoryId: 0,
            companyName: 0,
            cityId: 0,
            educationId: 0,
            experienceId: 0,
            userName: "",
            email: 0,
            phone: 0,
        };
    
        const data = {
            title: req.body.data.position || defaultValues.title,
            minSalary: req.body.data.minSalary || defaultValues.minSalary,
            maxSalary: req.body.data.maxSalary || defaultValues.maxSalary,
            minAge: req.body.data.minAge || defaultValues.minAge,
            maxAge: req.body.data.maxAge || defaultValues.maxAge,
            categoryId: req.body.data.category || defaultValues.categoryId,
            companyName: req.body.data.companyName || defaultValues.companyName,
            cityId: req.body.data.city || defaultValues.cityId,
            educationId: req.body.data.education || defaultValues.educationId,
            experienceId: req.body.data.experience || defaultValues.experienceId,
            userName: req.body.data.username || defaultValues.userName,
            email: req.body.data.email || defaultValues.email,
            phone: req.body.data.phone || defaultValues.phone,
        };
    
        // Email format validation
        if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
            data.email = defaultValues.email;
        }
    
        // Required field validation
        const requiredFields = [
            "title",
            "companyName",
            "userName",
            "categoryId",
            "cityId",
            "email",
            "educationId",
            "experienceId",
            "phone",
        ];
    
        const hasValidationError = requiredFields.some((field) => !data[field]);
    
        if (hasValidationError) {
            return res.status(200).json({
                status: 400,
                message: "Validation failed. Please correct the fields.",
                data,
            });
        }
    
        next();
    },
    

}
export default Validators;

