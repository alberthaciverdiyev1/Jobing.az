import express from 'express';
import cvController from '../Controllers/CVController.js';
import jobSeekerController from '../Controllers/JobSeekerController.js';
import authMiddleware from '../../../Middlewares/Auth.js';
import { addJobSeekerValidator } from '../Validators/CVValidator.js';
import { jobLimiter } from '../../../Middlewares/RateLimit.js';

const router = express.Router();

// CV Routes (Profile)
router.get('/profil/cvlarim', authMiddleware.authenticate, cvController.list);
router.post('/profil/cv/create', authMiddleware.authenticate, cvController.createPost);
router.post('/profil/cv/upload', authMiddleware.authenticate, cvController.uploadPost);
router.post('/profil/cv/:id/delete', authMiddleware.authenticate, cvController.deletePost);

// JobSeeker Routes
router.get('/is-axtaranlar', jobSeekerController.list);
router.get('/is-axtaranlar/elave-et', authMiddleware.authenticate, jobSeekerController.addPage);
router.post('/is-axtaranlar/elave-et', authMiddleware.authenticate, jobLimiter, addJobSeekerValidator, jobSeekerController.addPost);
router.get('/is-axtaranlar/:id/details', jobSeekerController.details);
router.post('/is-axtaranlar/:id/delete', authMiddleware.authenticate, jobSeekerController.deletePost);

export default router;
