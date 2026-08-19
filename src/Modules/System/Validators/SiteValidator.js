export const siteValidator = (req, res, next) => {
    const { name, url } = req.body;
    if (!name) return res.status(400).json({ error: "Site name is required" });
    if (!url) return res.status(400).json({ error: "Site url is required" });
    next();
};
