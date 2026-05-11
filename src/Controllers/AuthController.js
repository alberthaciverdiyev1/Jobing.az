import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import CompanyService from '../Services/CompanyService.js';
import { JWT_SECRET } from '../Middlewares/Auth.js';

const generateToken = (user, rememberMe = false) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: rememberMe ? '30d' : '7d' }
    );
};

const AuthController = {
    register: async (req, res) => {
        try {
            const { name, surname, email, password, role, companyName, phone } = req.body;

            const existing = await User.findOne({ email });
            if (existing) {
                return res.status(400).json({ error: 'Bu email artıq qeydiyyatdan keçib' });
            }

            const user = new User({
                name, surname, email, password, role,
                companyName: role === 'company' ? companyName : null,
                phone
            });

            await user.save();

            // Auto-create Company record for company role
            if (role === 'company' && companyName) {
                try {
                    await CompanyService.createFromRegistration({
                        companyName,
                        email,
                        phone
                    });
                } catch (companyErr) {
                    console.error('Company auto-create failed:', companyErr.message);
                }
            }

            const token = generateToken(user);
            const maxAge = 7 * 24 * 60 * 60 * 1000;

            res.cookie('token', token, {
                httpOnly: true,
                maxAge,
                sameSite: 'lax',
                path: '/'
            });

            res.status(201).json({
                message: role === 'company'
                    ? 'Şirkət hesabınız uğurla yaradıldı'
                    : 'Hesabınız uğurla yaradıldı',
                user: user.toJSON()
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password, rememberMe } = req.body;

            const user = await User.findOne({ email, isActive: true });
            if (!user) {
                return res.status(401).json({ error: 'Email və ya şifrə yanlışdır' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Email və ya şifrə yanlışdır' });
            }

            const token = generateToken(user, rememberMe);
            const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

            res.cookie('token', token, {
                httpOnly: true,
                maxAge,
                sameSite: 'lax',
                path: '/'
            });

            res.json({
                message: 'Giriş uğurludur',
                user: user.toJSON()
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    logout: async (req, res) => {
        res.clearCookie('token', { path: '/' });
        if (req.method === 'GET') {
            return res.redirect('/auth');
        }
        res.json({ message: 'Çıxış edildi' });
    },

    getMe: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Daxil olmaq tələb olunur' });
        }
        res.json({ user: req.user });
    }
};

export default AuthController;
