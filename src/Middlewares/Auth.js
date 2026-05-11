import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jobing-az-jwt-secret-2024-develop';

const authMiddleware = {

    /** Attach user to req/res.locals if a valid token cookie exists (non-blocking) */
    setUser: async (req, res, next) => {
        try {
            const token = req.cookies?.token;
            if (token) {
                const decoded = jwt.verify(token, JWT_SECRET);
                const user = await User.findById(decoded.id).select('-password');
                if (user && user.isActive) {
                    req.user = user;
                    res.locals.user = user;
                } else {
                    res.clearCookie('token');
                }
            }
        } catch {
            res.clearCookie('token');
        }
        next();
    },

    /** Require a logged-in user (redirect or 401) */
    authenticate: (req, res, next) => {
        if (!req.user) {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(401).json({ error: 'Daxil olmaq tələb olunur' });
            }
            return res.redirect('/auth');
        }
        next();
    },

    /** Restrict to one or more roles */
    authorize: (...roles) => (req, res, next) => {
        const isApi = req.path.startsWith('/api/');
        if (!req.user) {
            if (isApi) return res.status(401).json({ error: 'Daxil olmaq tələb olunur' });
            return res.redirect('/auth');
        }
        if (!roles.includes(req.user.role)) {
            if (isApi) return res.status(403).json({ error: 'Bu əməliyyat üçün icazəniz yoxdur' });
            if (req.user.role === 'company') {
                return res.redirect('/company/dashboard');
            }
            if (req.user.role === 'hr') {
                return res.redirect('/hr/dashboard');
            }
            return res.redirect('/dashboard');
        }
        next();
    }
};

export { JWT_SECRET };
export default authMiddleware;
