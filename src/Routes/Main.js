import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const i18n = require('i18n');
import { logError } from '../Middlewares/Logger.js';

// Import Module Routes
import authRoutes from '../Modules/Auth/Routes/AuthRoutes.js';
import contentRoutes from '../Modules/Content/Routes/ContentRoutes.js';
import cvRoutes from '../Modules/CV/Routes/CVRoutes.js';
import vacancyRoutes from '../Modules/Vacancy/Routes/VacancyRoutes.js';
import companyRoutes from '../Modules/Company/Routes/CompanyRoutes.js';
import systemRoutes from '../Modules/System/Routes/SystemRoutes.js';
import filterRoutes from "../Modules/Filters/Routes/FilterRoutes.js";

// Old Monolithic routes that will be moved to modules
import adminRoutes from '../Modules/Admin/Routes/AdminRoutes.js';

const router = express.Router();

// Mount all API module routes
router.use(authRoutes);
router.use(contentRoutes);
router.use(cvRoutes);
router.use(vacancyRoutes);
router.use(companyRoutes);
router.use(systemRoutes);
router.use(filterRoutes);

// Mount Admin/HR/View routes
router.use(adminRoutes);

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
    logError(err, { source: 'main-router-error', url: req?.originalUrl || req?.url });
    console.error('Route error:', err.message);
    res.render('Partials/Error.ejs');
});

export default router;
