import helmet from 'helmet';
import csurf from 'csurf';

// Helmet setup for basic HTTP security
export const helmetMiddleware = helmet({
    contentSecurityPolicy: false, // Disabling CSP for now to allow external CDNs (EJS templates often use them)
    crossOriginEmbedderPolicy: false
});

const csrf = csurf({ cookie: true });

// CSRF Protection (expects cookie-parser to be initialized before it)
// JSON API auth endpoints are exempt — they are protected by rate limiting,
// and the SPA frontend does not send CSRF tokens with axios calls.
export const csrfProtection = (req, res, next) => {
    if (req.path.startsWith('/api/auth/')) return next();
    return csrf(req, res, next);
};

// Middleware to inject CSRF token into all EJS locals
export const csrfInjector = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
    next();
};
