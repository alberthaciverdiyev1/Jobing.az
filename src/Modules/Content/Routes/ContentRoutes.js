import express from 'express';
import contentController from '../Controllers/ContentController.js';

const router = express.Router();

router.get('/bloq', contentController.blogList);
router.get('/bloq/:id/details', contentController.blogDetails);

router.get('/xeberler', contentController.newsList);
router.get('/xeberler/:id/details', contentController.newsDetails);

export default router;
