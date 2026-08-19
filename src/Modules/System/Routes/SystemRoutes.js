import express from 'express';
import systemController from '../Controllers/SystemController.js';

const router = express.Router();

router.get('/', systemController.index);
router.get('/haqqimizda', systemController.about);
router.get('/elaqe', systemController.contact);
router.get('/faq', systemController.faq);
router.get('/qiymetler', systemController.pricing);
router.get('/sitemap.xml', systemController.sitemap);
router.get('/robots.txt', systemController.robots);

export default router;
