import AuthService from '../Services/AuthService.js';

const AuthController = {
    // GET /login
    loginPage: (req, res) => {
        if (req.user) return res.redirect('/profile');
        res.render('Main', {
            title: 'Daxil Ol',
            body: 'Auth/Index.ejs',
            js: 'Auth.js',
            currentPage: 'login',
            error: req.query.error || null
        });
    },

    // POST /login
    loginPost: async (req, res, next) => {
        try {
            const { email, password, rememberMe } = req.body;
            const { token, maxAge } = await AuthService.login(email, password, rememberMe);
            
            res.cookie('token', token, {
                httpOnly: true,
                maxAge,
                sameSite: 'lax',
                path: '/'
            });

            res.redirect('/profile');
        } catch (err) {
            // Redirect back with error message
            res.redirect(`/login?error=${encodeURIComponent(err.message)}`);
        }
    },

    // GET /register
    registerPage: (req, res) => {
        if (req.user) return res.redirect('/profile');
        res.render('Main', {
            title: 'Qeydiyyat',
            body: 'Auth/Index.ejs',
            js: 'Auth.js',
            currentPage: 'register',
            error: req.query.error || null
        });
    },

    // POST /register
    registerPost: async (req, res, next) => {
        try {
            const { token, maxAge } = await AuthService.register(req.body);
            
            res.cookie('token', token, {
                httpOnly: true,
                maxAge,
                sameSite: 'lax',
                path: '/'
            });

            res.redirect('/profile?success=true');
        } catch (err) {
            res.redirect(`/register?error=${encodeURIComponent(err.message)}`);
        }
    },

    // POST /api/auth/login
    apiLogin: async (req, res) => {
        try {
            const { email, password, rememberMe } = req.body;
            const { token, maxAge, user } = await AuthService.login(email, password, rememberMe);

            res.cookie('token', token, {
                httpOnly: true,
                maxAge,
                sameSite: 'lax',
                path: '/'
            });

            res.json({ message: 'Uğurla daxil oldunuz', user });
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    },

    // POST /api/auth/register
    apiRegister: async (req, res) => {
        try {
            const { token, maxAge, user } = await AuthService.register(req.body);

            res.cookie('token', token, {
                httpOnly: true,
                maxAge,
                sameSite: 'lax',
                path: '/'
            });

            res.status(201).json({ message: 'Qeydiyyat uğurla tamamlandı', user });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // GET|POST /api/auth/logout
    apiLogout: (req, res) => {
        res.clearCookie('token', { path: '/' });
        // GET = browser navigation from <a href> links (Admin/Hr navbars)
        if (req.method === 'GET') {
            return res.redirect('/');
        }
        // POST = axios calls from the SPA (UserMenu, MobileBottomNav)
        res.json({ message: 'Çıxış edildi' });
    },

    // GET /logout
    logout: (req, res) => {
        res.clearCookie('token', { path: '/' });
        res.redirect('/login');
    },

    // GET /profile
    profilePage: (req, res) => {
        if (!req.user) return res.redirect('/login');
        res.render('Main', {
            title: 'Profil',
            body: 'Profile/Settings.ejs',
            js: 'Profile.js',
            currentPage: 'profile',
            user: req.user,
            success: req.query.success || null,
            error: req.query.error || null
        });
    },

    // POST /profile/update
    updateProfilePost: async (req, res, next) => {
        try {
            await AuthService.updateProfile(req.user.id, req.body);
            res.redirect('/profile?success=Profil+yenilendi');
        } catch (error) {
            res.redirect(`/profile?error=${encodeURIComponent(error.message)}`);
        }
    }
};

export default AuthController;
