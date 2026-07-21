import Seo from '../Models/Seo.js';
import Cache from '../Helpers/Cache.js';

const SEO_CACHE_TTL = 600; // 10 minutes

const seoMiddleware = async (req, res, next) => {
    try {
        let path = req.path.replace(/\/+$/, '') || '/';

        // If this route has a customRoute set, redirect to it (original no longer works)
        const routeWithCustom = await Seo.findOne({ route: path, isActive: true, customRoute: { $ne: '' } }).lean();
        if (routeWithCustom) {
            let redirectUrl = routeWithCustom.customRoute;
            const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
            return res.redirect(301, redirectUrl + qs);
        }

        // Check if this path matches a custom route alias
        const customEntry = await Seo.findOne({ customRoute: path, isActive: true }).lean();
        if (customEntry && customEntry.route) {
            req.url = req.originalUrl.replace(req.path, customEntry.route);
            path = customEntry.route;
        }

        // Look up SEO data for the (possibly rewritten) path — cached
        const cacheKey = `seo:${path}`;
        let seo = Cache.get(cacheKey);
        if (!seo) {
            seo = await Seo.findOne({ route: path, isActive: true }).lean();
            if (seo) Cache.set(cacheKey, seo, SEO_CACHE_TTL);
        }

        if (!seo) {
            const parentPath = '/' + path.split('/').filter(Boolean).slice(0, 1).join('/');
            if (parentPath !== path) {
                const parentCacheKey = `seo:${parentPath}`;
                seo = Cache.get(parentCacheKey);
                if (!seo) {
                    seo = await Seo.findOne({ route: parentPath, isActive: true }).lean();
                    if (seo) Cache.set(parentCacheKey, seo, SEO_CACHE_TTL);
                }
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
