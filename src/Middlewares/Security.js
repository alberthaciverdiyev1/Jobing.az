import helmet from 'helmet';
import csurf from 'csurf';

// Helmet setup for basic HTTP security
export const helmetMiddleware = helmet({
    contentSecurityPolicy: false, // Disabling CSP for now to allow external CDNs (EJS templates often use them)
    crossOriginEmbedderPolicy: false
});

// CSRF Protection (expects cookie-parser to be initialized before it)
export const csrfProtection = csurf({ cookie: true });

// Middleware to inject CSRF token into all EJS locals
export const csrfInjector = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};
