import Seo from '../Modules/System/Entities/Seo.js';
import Cache from '../Helpers/Cache.js';

const SEO_CACHE_TTL = 600; // 10 minutes

const seoMiddleware = async (req, res, next) => {
    try {
        let path = req.path.replace(/\/+$/, '') || '/';

        // Custom route redirect check — cached (rarely changes)
        let routeWithCustom = Cache.get(`seo:redirect:${path}`);
        if (routeWithCustom === undefined) {
            routeWithCustom = await Seo.findOne({ route: path, isActive: true, customRoute: { $ne: '' } }).lean() || null;
            Cache.set(`seo:redirect:${path}`, routeWithCustom, SEO_CACHE_TTL);
        }
        if (routeWithCustom) {
            const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
            return res.redirect(301, routeWithCustom.customRoute + qs);
        }

        // Custom route alias check — cached
        let customEntry = Cache.get(`seo:alias:${path}`);
        if (customEntry === undefined) {
            customEntry = await Seo.findOne({ customRoute: path, isActive: true }).lean() || null;
            Cache.set(`seo:alias:${path}`, customEntry, SEO_CACHE_TTL);
        }
        if (customEntry && customEntry.route) {
            req.url = req.originalUrl.replace(req.path, customEntry.route);
            path = customEntry.route;
        }

        // Look up SEO data — cached
        let seoData = Cache.get(`seo:data:${path}`);
        if (seoData === undefined) {
            seoData = await Seo.findOne({ route: path, isActive: true }).lean() || null;
            Cache.set(`seo:data:${path}`, seoData, SEO_CACHE_TTL);
        }

        if (!seoData) {
            const parentPath = '/' + path.split('/').filter(Boolean).slice(0, 1).join('/');
            if (parentPath !== path) {
                seoData = Cache.get(`seo:data:${parentPath}`);
                if (seoData === undefined) {
                    seoData = await Seo.findOne({ route: parentPath, isActive: true }).lean() || null;
                    Cache.set(`seo:data:${parentPath}`, seoData, SEO_CACHE_TTL);
                }
            }
        }

        if (seoData) {
            res.locals.seo = seoData;
        }

        next();
    } catch (error) {
        console.error('SEO middleware error:', error.message);
        next();
    }
};

export default seoMiddleware;
