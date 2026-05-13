import Seo from '../Models/Seo.js';

const seoMiddleware = async (req, res, next) => {
    try {
        let path = req.path.replace(/\/+$/, '') || '/';

        // Check if this path matches a custom route alias
        const customEntry = await Seo.findOne({ customRoute: path, isActive: true }).lean();
        if (customEntry && customEntry.route) {
            req.url = req.originalUrl.replace(req.path, customEntry.route);
            path = customEntry.route;
        }

        // Look up SEO data for the (possibly rewritten) path
        let seo = await Seo.findOne({ route: path, isActive: true }).lean();

        if (!seo) {
            const parentPath = '/' + path.split('/').filter(Boolean).slice(0, 1).join('/');
            if (parentPath !== path) {
                seo = await Seo.findOne({ route: parentPath, isActive: true }).lean();
            }
        }

        if (seo) {
            res.locals.seo = seo;
        }

        next();
    } catch (error) {
        console.error('SEO middleware error:', error.message);
        next();
    }
};

export default seoMiddleware;
