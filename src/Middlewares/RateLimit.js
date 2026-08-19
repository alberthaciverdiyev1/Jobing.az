import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Çox sayda cəhd. Zəhmət olmasa bir az sonra yenidən cəhd edin.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const jobLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Çox sayda elan göndərmə cəhdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: 'Çox sayda sorğu. Zəhmət olmasa bir az sonra yenidən cəhd edin.' },
    standardHeaders: true,
    legacyHeaders: false,
});
