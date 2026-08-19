export const companyValidator = (req, res, next) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Company name is required" });
    next();
};
