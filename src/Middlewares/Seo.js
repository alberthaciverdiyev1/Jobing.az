import Seo from '../Modules/System/Entities/Seo.js';
import Cache from '../Helpers/Cache.js';

const SEO_CACHE_TTL = 600;

const seoMiddleware = async (req, res, next) => {
    try {
        let reqPath = req.path.replace(/\/+$/, '') || '/';

        // Look up SEO data by path — cached
        let seoData = Cache.get(`seo:data:${reqPath}`);
        if (seoData === undefined) {
            seoData = await Seo.findOne({ where: { path: reqPath, isActive: true } });
            Cache.set(`seo:data:${reqPath}`, seoData || null, SEO_CACHE_TTL);
        }

        // Fallback: try parent path
        if (!seoData) {
            const parentPath = '/' + reqPath.split('/').filter(Boolean).slice(0, 1).join('/');
            if (parentPath !== reqPath) {
                seoData = Cache.get(`seo:data:${parentPath}`);
                if (seoData === undefined) {
                    seoData = await Seo.findOne({ where: { path: parentPath, isActive: true } });
                    Cache.set(`seo:data:${parentPath}`, seoData || null, SEO_CACHE_TTL);
                }
            }
        }

        if (seoData) {
            res.locals.seo = seoData.toJSON ? seoData.toJSON() : seoData;
        }

        next();
    } catch (error) {
        // Silently continue if SEO table doesn't exist yet
        next();
    }
};

export default seoMiddleware;
