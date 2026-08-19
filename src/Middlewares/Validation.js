import { z } from 'zod';

// Utility middleware to validate request body against a Zod schema
export const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            // If it's a validation error, redirect back with error message
            if (error instanceof z.ZodError) {
                const errorMsg = error.errors.map(e => e.message).join(', ');
                const backUrl = req.header('Referer') || '/';
                const separator = backUrl.includes('?') ? '&' : '?';
                return res.redirect(`${backUrl}${separator}error=${encodeURIComponent(errorMsg)}`);
            }
            next(error);
        }
    };
};

// Example Schemas
export const schemas = {
    loginSchema: z.object({
        email: z.string().email("Geçerli bir e-posta adresi giriniz"),
        password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
        rememberMe: z.string().optional()
    }),
    registerSchema: z.object({
        name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
        surname: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
        email: z.string().email("Geçerli bir e-posta adresi giriniz"),
        password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
        role: z.enum(['user', 'company']).optional(),
        companyName: z.string().optional(),
        phone: z.string().optional()
    })
};
