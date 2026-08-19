import UserRepository from '../Repositories/UserRepository.js';
import IAuthService from '../Interfaces/IAuthService.js';
import CompanyRepository from '../../Company/Repositories/CompanyRepository.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

class AuthService extends IAuthService {
    
    _generateToken(user, rememberMe = false) {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: rememberMe ? '30d' : '7d' }
        );
    }

    async register(data) {
        const existing = await UserRepository.findByEmail(data.email);
        if (existing) {
            throw new Error('Bu email artıq qeydiyyatdan keçib');
        }

        const user = await UserRepository.create({
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: data.password, // Hook handles hash
            role: data.role || 'user',
            companyName: data.role === 'company' ? data.companyName : null,
            phone: data.phone
        });

        if (data.role === 'company' && data.companyName) {
            try {
                const compExists = await CompanyRepository.findOne({ where: { companyName: data.companyName } });
                if (!compExists) {
                    await CompanyRepository.create({
                        companyName: data.companyName,
                        email: data.email,
                        phone: data.phone
                    });
                }
            } catch (companyErr) {
                console.error('Company auto-create failed:', companyErr.message);
            }
        }

        const token = this._generateToken(user);
        return { user, token, maxAge: 7 * 24 * 60 * 60 * 1000 };
    }

    async login(email, password, rememberMe) {
        const user = await UserRepository.findActiveByEmail(email);
        if (!user) {
            throw new Error('Email və ya şifrə yanlışdır və ya hesab passivdir');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Email və ya şifrə yanlışdır');
        }

        const token = this._generateToken(user, rememberMe);
        const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

        return { user, token, maxAge };
    }

    async updateProfile(userId, data) {
        const updateObj = {};
        if (data.phone !== undefined) updateObj.phone = data.phone;
        if (data.age !== undefined) updateObj.age = data.age ? Number(data.age) : null;
        
        // Remove cityId, categoryId since we removed them from User table!
        // If users need properties, they will go to user_filter_options

        const user = await UserRepository.update(userId, updateObj);
        if (!user) throw new Error('İstifadəçi tapılmadı');

        return user;
    }
}

export default new AuthService();
