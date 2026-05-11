import express from 'express';
import viewRoutes from './ViewRoutes.js';
import apiRoutes from './ApiRoutes.js';
import adminRoutes from './AdminRoutes.js';
import hrRoutes from './HrRoutes.js';

const router = express.Router();

// Mount route groups
router.use(viewRoutes);
router.use(apiRoutes);
router.use(adminRoutes);
router.use(hrRoutes);

// ============================================================
// CHANGE LANGUAGE
// ============================================================
router.post('/set-lang', (req, res) => {
    const { language } = req.body;
    try {
        if (i18n.getLocales().includes(language)) {
            res.cookie('lang', language);
            return res.send({ message: 'Language updated successfully' });
        }
    } catch {}
    res.status(400).send({ error: 'Invalid language' });
});

// ============================================================
// 404 HANDLER
// ============================================================
router.use((req, res) => {
    res.render('Partials/Error.ejs');
});

router.use((err, req, res, next) => {
    console.error('Route error:', err.message);
    console.error(err.stack?.split('\n').slice(0, 3).join('\n'));
    res.render('Partials/Error.ejs');
});

export default router;
