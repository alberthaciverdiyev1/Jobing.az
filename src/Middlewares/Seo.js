import Seo from '../Models/Seo.js';

const seoMiddleware = async (req, res, next) => {
    try {
        const path = req.path.replace(/\/+$/, '') || '/';
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
