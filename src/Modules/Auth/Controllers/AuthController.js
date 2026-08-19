import AuthService from '../Services/AuthService.js';

const AuthController = {
    // GET /login
    loginPage: (req, res) => {
        if (req.user) return res.redirect('/profile');
        res.render('Main', {
            title: 'Daxil Ol',
            body: 'Auth/Login.ejs',
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
            body: 'Auth/Register.ejs',
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
            body: 'Auth/Profile.ejs',
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
